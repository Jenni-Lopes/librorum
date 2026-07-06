import axios from "axios";

/* -- Pesquisa livros pelo nome -- */
export async function searchBooks(nome: string) {
    const response = await axios.get(
        "https://www.googleapis.com/books/v1/volumes",
        {
            params: {
                q: nome,
                key: process.env.GOOGLE_BOOKS_API_KEY
            }
        }
    );

    return (response.data.items ?? []).map((book: any) => ({
        id: book.id,
        titulo: book.volumeInfo.title,
        autores: book.volumeInfo.authors,
        capa: book.volumeInfo.imageLinks?.thumbnail,
        descricao: book.volumeInfo.description,
    }));
}

/* -- Busca pelo ID -- */

export async function searchBookById(id: string) {
    const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes/${id}`,
        {
            params: {
                key: process.env.GOOGLE_BOOKS_API_KEY
            }
        }
    );

    const book = response.data;

    return {
        id: book.id,
        titulo: book.volumeInfo.title,
        autores: book.volumeInfo.authors?.join(", "),
        imagem: book.volumeInfo.imageLinks?.thumbnail,
        paginas: book.volumeInfo.pageCount,
        publicadoEm: book.volumeInfo.publishedDate,
        idioma: book.volumeInfo.language,
        categoria: book.volumeInfo.categories?.[0],
        descricao: book.volumeInfo.description,
    };
}
