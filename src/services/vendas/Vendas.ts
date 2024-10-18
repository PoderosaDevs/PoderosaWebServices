import { GraphQLError } from "graphql";
import { prisma } from "../../database";
import { VendaDetalheInput } from "../../inputs/vendas/VendaDetalhe";
import { VendaInput } from "../../inputs/vendas/Vendas";

class VendaServices {
  // Obtém todas as vendas
  async get(startDate?: Date, endDate?: Date) {
    try {
      const vendas = await prisma.venda.findMany({
        where: {
          ...(startDate && endDate ? {
            data_venda: {
              gte: startDate,
              lte: endDate,
            },
          } : startDate ? {
            data_venda: {
              equals: startDate,
            },
          } : {}), // Se não houver datas, não aplica filtro
        },
        include: {
          venda_detalhe: {
            include: {
              produto: true,
            },
          },
          funcionario: true,
        },
        orderBy: {
          data_venda: 'desc', // Ordenar do mais recente para o mais antigo
        },
      });

      return vendas.map((venda) => ({
        ...venda,
        venda_detalhe: venda.venda_detalhe || [], // Garante que venda_detalhes nunca seja null
      }));
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      throw new Error("Erro ao buscar vendas.");
    }
  }



  // Obtém uma venda por ID
  async getByID(id: number) {
    try {
      const venda = await prisma.venda.findUnique({
        where: { id },
        include: {
          venda_detalhe: {
            include: {
              produto: true,
            },
          },
          funcionario: true,
        },
      });

      if (!venda) {
        throw new GraphQLError("Venda não encontrada.");
      }

      return {
        id: venda.id, // Certifique-se de que o id é retornado
        data_venda: venda.data_venda,
        pontos_totais: venda.pontos_totais,
        situacao: venda.situacao,
        funcionario: {
          id: venda.funcionario.id,
          nome: venda.funcionario.nome,
        },
        venda_detalhe: venda.venda_detalhe.map((detail) => ({
          produto: {
            id: detail.produto.id,
            nome: detail.produto.nome,
            imagem: detail.produto.imagem,
          },
          pontos: detail.pontos,
        })),
      };
    } catch (error) {
      console.error("Erro ao buscar venda por ID:", error);
      throw new GraphQLError("Erro ao buscar venda por ID.");
    }
  }

  async getByUserID(id: number) {
    try {
      const vendas = await prisma.venda.findMany({
        where: { funcionario_id: id },
        include: {
          venda_detalhe: {
            include: {
              produto: true,
            },
          },
          funcionario: true,
        },
      });

      if (vendas.length === 0) {
        throw new GraphQLError("Nenhuma venda encontrada para este usuário.");
      }

      return vendas.map((venda) => ({
        id: venda.id,
        data_venda: venda.data_venda,
        pontos_totais: venda.pontos_totais,
        situacao: venda.situacao,
        funcionario: {
          id: venda.funcionario.id,
          nome: venda.funcionario.nome,
        },
        venda_detalhe: venda.venda_detalhe.map((detail) => ({
          produto: {
            id: detail.produto.id,
            nome: detail.produto.nome,
            imagem: detail.produto.imagem,
          },
          quantidade: detail.quantidade, // Inclua a quantidade aqui
          pontos: detail.pontos,
        })),
      }));
    } catch (error) {
      console.error("Erro ao buscar vendas por usuário ID:", error);
      throw new GraphQLError("Erro ao buscar vendas por usuário.");
    }
  }

// Cria uma nova venda
async create(data: VendaInput) {
  // Verifica se o funcionário existe e está ativo
  const funcionario = await prisma.usuario.findUnique({
    where: { id: data.funcionarioId },
    include: {
      tipo_sistemas: {
        where: {
          tipo_sistema: {
            nome: "SALES",
          },
        },
      },
    },
  });

  const loja = await prisma.loja.findUnique({
    where: { id: data.lojaId },
  });

  if (!loja) {
    throw new GraphQLError("Loja não encontrada.");
  }

  if (!funcionario) {
    throw new GraphQLError("Funcionário não encontrado.");
  }

  if (funcionario.tipo_pessoa !== "EMPLOYEE") {
    throw new GraphQLError("Usuário não é um funcionário.");
  }

  if (funcionario.tipo_sistemas.length === 0) {
    throw new GraphQLError(
      "Funcionário não está associado ao sistema 'SALES'."
    );
  }

  // Verifica se já existe uma venda na mesma data para o mesmo funcionário e loja
  const vendaExistente = await prisma.venda.findFirst({
    where: {
      funcionario_id: data.funcionarioId,
      loja_id: data.lojaId,
      data_venda: data.data_venda ?? new Date(), // Usa a data fornecida ou a data atual
    },
  });

  if (vendaExistente) {
    throw new GraphQLError("Já existe uma venda registrada nessa data para este funcionário e loja.");
  }

  // Verifica se os produtos existem e calcula os pontos totais
  let pontosTotais = 0;

  const vendaDetalhesCriados = await Promise.all(
    data.vendaDetalhes.map(async (detalhe: VendaDetalheInput) => {
      const produto = await prisma.produto.findUnique({
        where: { id: detalhe.produtoId },
      });

      if (!produto) {
        throw new GraphQLError(
          `Produto com ID ${detalhe.produtoId} não encontrado.`
        );
      }

      // Calcula os pontos baseados no produto e quantidade
      const pontos = (produto.pontos ?? 0) * (detalhe.quantidade ?? 0);
      pontosTotais += pontos;

      return {
        produto_id: detalhe.produtoId,
        quantidade: detalhe.quantidade ?? 0,
        pontos: pontos, // Define os pontos calculados para cada detalhe
      };
    })
  );

  // Cria a venda
  const venda = await prisma.venda.create({
    data: {
      funcionario_id: data.funcionarioId,
      loja_id: data.lojaId,
      data_venda: data.data_venda ?? new Date(), // Usa a data fornecida ou a data atual
      pontos_totais: pontosTotais,
      situacao: true, // Define a situação como ativa por padrão
      venda_detalhe: {
        create: vendaDetalhesCriados,
      },
    },
    include: {
      venda_detalhe: {
        include: {
          produto: true,
        },
      },
    },
  });

  return venda;
}


  // Atualiza uma venda existente
  async update(id: number, data: Partial<VendaInput>) {
    const venda = await prisma.venda.findUnique({
      where: { id },
      include: {
        venda_detalhe: true,
      },
    });

    if (!venda) {
      throw new GraphQLError("Venda não encontrada.");
    }

    // Obtém os detalhes da venda existentes
    const detalhesExistentes = venda.venda_detalhe;

    // Mapeia os IDs existentes para verificar quais detalhes precisam ser atualizados ou removidos
    const idsExistentes = new Set(
      detalhesExistentes.map((detalhe) => detalhe.id)
    );

    // Atualiza a venda
    const updatedVenda = await prisma.venda.update({
      where: { id },
      data: {
        data_venda: data.data_venda,
        pontos_totais: venda.pontos_totais, // Mantém os pontos totais atuais até recalcular
        venda_detalhe: {
          // Upsert para cada detalhe, mas atualiza apenas produto_id e quantidade
          upsert: (data.vendaDetalhes ?? []).map(
            (detalhe: VendaDetalheInput) => ({
              where: { id: detalhe.id || 0 },
              update: {
                produto_id: detalhe.produtoId, // Atualiza o produto se necessário
                quantidade: detalhe.quantidade, // Atualiza a quantidade
              },
              create: {
                produto_id: detalhe.produtoId,
                quantidade: detalhe.quantidade,
                pontos: 0, // A ponto será recalculado após a criação
              },
            })
          ),
          deleteMany: {
            id: {
              in: Array.from(idsExistentes).filter(
                (id) =>
                  !data.vendaDetalhes?.some((detalhe) => detalhe.id === id)
              ),
            },
          },
        },
      },
      include: {
        venda_detalhe: {
          include: {
            produto: true,
          },
        },
      },
    });

    // Recalcula os pontos totais
    const vendaDetalhesAtualizados = await prisma.venda_detalhe.findMany({
      where: { venda_id: id },
      include: { produto: true },
    });

    const pontosTotaisAtualizados = vendaDetalhesAtualizados.reduce(
      (total, detalhe) => {
        const pontos =
          (detalhe.produto.pontos ?? 0) * (detalhe.quantidade ?? 0);
        return total + pontos;
      },
      0
    );

    // Atualiza a venda com os pontos totais recalculados
    const vendaFinalizada = await prisma.venda.update({
      where: { id },
      data: { pontos_totais: pontosTotaisAtualizados },
      include: {
        venda_detalhe: {
          include: {
            produto: true,
          },
        },
      },
    });

    return vendaFinalizada;
  }

  // Deleta uma venda (define a situação como inativa)
  async delete(id: number) {
    const venda = await prisma.venda.findUnique({
      where: { id },
    });

    if (!venda) {
      throw new GraphQLError("Venda não encontrada.");
    }

    const deletedVenda = await prisma.venda.update({
      where: { id },
      data: { situacao: false },
    });

    return deletedVenda;
  }
}

export default new VendaServices();
