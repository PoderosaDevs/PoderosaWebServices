import { Categoria } from "../database/models";
import { ApiError } from "../utils/apiError";

class CategoriaService {
  async get() {
    return Categoria.findAll({ order: [["nome", "ASC"]] });
  }

  async getByID(id: number) {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) throw ApiError.notFound("Categoria nao encontrada.");
    return categoria;
  }

  async create(nome: string) {
    return Categoria.create({ nome });
  }

  async update(id: number, nome: string) {
    const categoria = await this.getByID(id);
    await categoria.update({ nome });
    return categoria;
  }

  async delete(id: number) {
    const categoria = await this.getByID(id);
    await categoria.destroy();
    return { message: "Categoria removida com sucesso." };
  }
}

export default new CategoriaService();
