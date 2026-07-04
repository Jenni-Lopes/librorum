import axios from "axios";

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

    return response.data.items.map((book: any) => ({
        id: book.id,
        titulo: book.volumeInfo.title,
        autores: book.volumeInfo.authors,
        capa: book.volumeInfo.imageLinks?.thumbnail,
        descricao: book.volumeInfo.description,
    }));
}