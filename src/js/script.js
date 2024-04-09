const inputCep = document.querySelector("#cep");
const btnSendCep = document.querySelector("#btn-send")
const containerResponse = document.querySelector(".container-data");
const spinner = document.querySelector("#spinner")

inputCep.addEventListener("input", () => {
    inputCep.value = inputCep.value.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
    if (inputCep.value.length < 9) containerResponse.classList.add("hide")
});

document.addEventListener("keypress", e => {
    if (e.key === "Enter" && inputCep.value.length == 9) searchCep(inputCep.value)
})

btnSendCep.addEventListener("click", () => {
    if (inputCep.value.length == 9){
        searchCep(inputCep.value)
        return
    } 
    messageField("Cep invalido")
})

async function searchCep(cep) {

    if (!cep) return

    try {
        spinner.classList.remove("hide-spin")
        const response = await fetch(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`);
        const data = await response.json();

        if (!data.cep) {
            messageField("Cep não encontrado.")
            return
        }

        generateResponse(data)

    } catch (error) {
        console.error("Ocorreu um erro ao buscar o CEP:", error);
        messageField("Error, tente mais tarde.")
    }
}

const messageField = msg => {

    spinner.classList.add("hide-spin")

    const error = document.querySelector(".error")

    if (msg === "hide"){
        error.classList.add("hide")
        return
    }

    error.innerText = msg
    error.classList.toggle("hide")
}

const generateResponse = data => {
    spinner.classList.add("hide-spin")
    messageField("hide")

    const templateResponse =`
    <span>Cep: ${data.cep}</span>
    <span>logradouro: ${data.logradouro}</span>
    <span>Complemento: ${data.complemento}</span>
    <span>Bairro: ${data.bairro}</span>
    <span>Localidade: ${data.localidade}</span>
    <span>UF: ${data.uf}</span>
    <span>IBGE: ${data.ibge}</span>
    <span>GIA: ${data.gia}</span>
    <span>DDD: ${data.ddd}</span>
    <span>Siafi: ${data.siafi}</span>`;

    containerResponse.innerHTML = templateResponse

    containerResponse.classList.remove("hide");
}