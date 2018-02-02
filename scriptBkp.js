$(function () {
    get("divFormulario").hide();
    get("divGrid").hide();
   
}());

function get(id) {
    return $("#" + id)
}

var storageSkin = localStorage.getItem("tbSkin");
var skins = !storageSkin ? [] : JSON.parse(storageSkin);
var salvarEditar = "";
atualizaSkin();
get("divGrid").hide();

function adicionarSkin() {
    get("divFormulario").slideDown();
    salvarEditar = "I";

    if (salvarEditar != "E")
        get("txtIdSteam").attr("readonly", false);
    get("btnCadastrar").attr("value", "Cadastrar");
    limpaCampos();
}

function salvarSkin() {
    var skin = {
        //idSteam: get("txtIdSteam").val(),
        Nome: get("txtNomeSkin").val(),
        Valor: get("txtValor").val(),
        IdEst: get("cmbEstado").find(":selected").val(),
        NomeEst: get("cmbEstado").find(":selected").text()
    };

    if (salvarEditar != "E") {
        console.log("cadastro");
        skins.push(skin);
        localStorage.setItem("tbSkin", JSON.stringify(skins));
        atualizaSkin();
        get("divFormulario").slideUp();
    }
    else {
        console.log("editar");
        skins[indexSkinSelecionada].Nome = skin.Nome;
        skins[indexSkinSelecionada].Valor = skin.Valor;
        skins[indexSkinSelecionada].NomeEst = skin.NomeEst;
        localStorage.setItem("tbSkin", JSON.stringify(skins));
        atualizaSkin();
    }
}

function atualizaSkin() {
    get("divFormulario").slideUp();
    var table = document.getElementById("tbGrid");
    var tbody = table.querySelector('tbody');
    tbody.innerHTML = "";
    get("divGrid").slideDown();

    for (var i = 0; i < skins.length; i++) {
        var elemento = skins[i];

        var row = tbody.insertRow();
        var celNome = row.insertCell(0);
        var celValor = row.insertCell(1);
        var celEstado = row.insertCell(2);
        var celExcluir = row.insertCell(3);
        var celEditar = row.insertCell(4);
        celValor.setAttribute("data-valor", "valor")
        celNome.innerHTML = elemento.Nome;
        celValor.innerHTML = elemento.Valor;
        celEstado.innerHTML = elemento.NomeEst;

        //Botão excluir
        var btnExcluir = document.createElement("button");
        btnExcluir.setAttribute("type", "button");
        btnExcluir.setAttribute("onclick", "excluir(" + i + ")");
        btnExcluir.appendChild(document.createTextNode("Excluir"));
        celExcluir.appendChild(btnExcluir);

        //Botão editar
        var btnEditar = document.createElement("button");
        btnEditar.setAttribute("type", "button");
        btnEditar.setAttribute("onclick", "exibeSkin(" + i + ")");
        btnEditar.appendChild(document.createTextNode("Editar"));
        celEditar.appendChild(btnEditar);
    }
}

function excluir(index) {
    if (!confirm("Deseja realmente excluir?"))
        return false;
    skins.splice(index, 1);
    localStorage.setItem("tbSkin", JSON.stringify(skins));
    atualizaSkin();
}

var indexSkinSelecionada;
function exibeSkin(index) {
    indexSkinSelecionada = index;
    salvarEditar = "E";
    get("btnCadastrar").attr("value", "Atualizar");
    // get("txtIdSteam").val(skins[index].idSteam).attr("readonly", true);
    get("txtNomeSkin").val(skins[index].Nome);
    get("txtValor").val(skins[index].Valor);
    get("cmbEstado").find(":selected").text(skins[index].NomeEst);
    get("divFormulario").slideDown();
}

function cancelarUpd() {
    get("divFormulario").slideUp();
    limpaCampos();
}

function buscar() {
    var pesquisaValor = get("txtValorPesq").val();
    if (pesquisaValor == "") {
        atualizaSkin();
        get("tbGrid").show();
    }

    $('table tbody tr').hide();
    $('table tbody tr td[data-valor]').each(function() {
        var texto = $(this).text();
        if(texto.indexOf(pesquisaValor) >= 0){
            get("divGrid").slideDown();
            $(this).closest('tr').show();
        }
    });
}

function limpaCampos() {
    get("txtNomeSkin").val('');
    get("txtValor").val('');
}
