import { ApiError } from "../utils/apiError";
import { comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { Usuario } from "../database/models";
import { TipoPessoa } from "../types/enums";

class AutenticacaoService {
  async login(email: string, senha: string) {
    const usuario = await Usuario.findOne({ where: { email, situacao: true } });

    if (!usuario) {
      throw ApiError.unauthorized("Usuario nao existe!");
    }

    const senhaValida = await comparePassword(senha, usuario.senha);
    if (!senhaValida) {
      throw ApiError.unauthorized("Senha invalida!");
    }

    const token = signToken({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      funcao: usuario.funcao,
      tipo_pessoa: usuario.tipo_pessoa as TipoPessoa,
      complemento: usuario.complemento,
      cpf: usuario.cpf,
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        uuid: usuario.uuid,
        nome: usuario.nome,
        email: usuario.email,
        funcao: usuario.funcao,
        tipo_pessoa: usuario.tipo_pessoa,
        cpf: usuario.cpf,
        data_nascimento: usuario.data_nascimento,
        usuario_foto: usuario.usuario_foto,
      },
    };
  }
}

export default new AutenticacaoService();
