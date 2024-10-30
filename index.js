import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res)=>{
    res.send("Bienvenidos a nuestra API...");
});

app.listen(3000, ()=>{
    console.log("Aplicacion escuchando por el puerto 3000");
});

const readData = ()=>{
    const data =fs.readFileSync("./db.json");
    console.log(JSON.parse(data));
    return(JSON.parse(data));
};

readData();

const WriteData = (data) => {
    try{
        fs.writeFileSync("./db.json", JSON.stringify(data));
    }catch (eror){
        console.log("Error");
    }
};

app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

app.get("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    res.json(book);
});

app.post("/books", (req, res) => {
    const data = readData();
    const body =req.body;
    const newBook = {
        id: data.books.length + 1,
        ...body,
    };
    data.books.push(newBook);
    WriteData(data);
    res.json(newBook);
});

app.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    // Verifica si el libro existe
    if (bookIndex === -1) {
        return res.status(404).json({ message: "Libro no encontrado" });
    }
    // Actualiza el libro encontrado
    data.books[bookIndex] = {
        ...data.books[bookIndex],
        ...body,
    };
    // Guarda los datos actualizados
    WriteData(data);
    res.json({ message: "Libro actualizado" });
});

app.delete("/books/:id", (req, res) => {
    try {
        const data = readData();
        const id = parseInt(req.params.id);
    // Verificamos si el id es un número válido
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
    // Buscamos el índice del libro con el id proporcionado
        const bookIndex = data.books.findIndex((book) => book.id === id);
    // Validamos que el índice exista
        if (bookIndex === -1) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }
    // Eliminamos el libro del arreglo
        data.books.splice(bookIndex, 1);
        WriteData(data);
    // Respondemos confirmando la eliminación
        res.json({ message: "Libro eliminado exitosamente" });
        } catch (error) {
        res.status(500).json({ error: "Ocurrió un error al eliminar el libro" });
    }
});