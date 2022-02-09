const app = require("./server");

app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("Servidor rodando na porta 3000")
})