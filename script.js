$(function () {
    get("divFormulario").hide();
    get("divGrid").hide();
}());

function get(id) {
    return $("#" + id)
};

var url;
var teste;
var storageSkin = localStorage.getItem("tbSkin");
var skins = !storageSkin ? [] : JSON.parse(storageSkin);
var salvarEditar = "";

document.getElementById("btnCadastrar").addEventListener('click', function () {
    var input = document.getElementById("imgSkin").files[0];
    if (input != null)
        getBase64(input);

    get("tbGrid").show();
    get("divErro").hide();
    salvarSkin();

});

function adicionarSkin() {
    get("imgPreview").attr("src", "");
    get("divFormulario").slideDown();
    get("divErro").hide();
    salvarEditar = "I";

    if (salvarEditar != "E")
        get("txtIdSteam").attr("readonly", false);
    get("btnCadastrar").attr("value", "Cadastrar");
    limpaCampos();
};

function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        url = reader.result;

        $("#imgPreview").attr('src', e.target.result);
        //salvarSkin();
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    }
};

function salvarSkin() {
    var skin = {
        Nome: get("txtNomeSkin").val(),
        Valor: get("txtValor").val(),
        IdEst: get("cmbEstado").find(":selected").val(),
        NomeEst: get("cmbEstado").find(":selected").text(),
        UrlImg: url
    };
    if (salvarEditar != "E") {
        skins.push(skin);
        localStorage.setItem("tbSkin", JSON.stringify(skins));
        url = "";
        atualizaSkin();
        get("divFormulario").slideUp();
    }
    else {
        skins[indexSkinSelecionada].Nome = skin.Nome;
        skins[indexSkinSelecionada].Valor = skin.Valor;
        skins[indexSkinSelecionada].NomeEst = skin.NomeEst;
        skins[indexSkinSelecionada].UrlImg = skin.UrlImg;
        localStorage.setItem("tbSkin", JSON.stringify(skins));
        atualizaSkin();
    }
    get("divGrid").show();
};

function atualizaSkin() {
    get("divFormulario").slideUp();
    var table = document.getElementById("tbGrid");
    var tbody = table.querySelector('tbody');
    tbody.innerHTML = "";
    get("divGrid").slideDown();
    debugger;
    if (skins.length == 0) {
        teste = 0;
        get("divErro").show();
        get("tbGrid").hide();
    }
    else {
        teste = 1;
        for (var i = 0; i < skins.length; i++) {
            var elemento = skins[i];
            var img = document.createElement("img");
            img.setAttribute("src", elemento.UrlImg);
            // img.className = "imgGrid";
            var row = tbody.insertRow();
            var celNome = row.insertCell(0);
            var celValor = row.insertCell(1);
            var celEstado = row.insertCell(2);
            var celImg = row.insertCell(3);
            var celExcluir = row.insertCell(4);
            var celEditar = row.insertCell(5);
            celImg.appendChild(img);
            celValor.setAttribute("data-valor", "valor")
            celNome.innerHTML = elemento.Nome;
            celValor.innerHTML = elemento.Valor;
            celEstado.innerHTML = elemento.NomeEst;
            img.setAttribute("data-img", "");
            //excluir
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

            //Configuração da modal
            var image = $("table tbody td").find('[data-img]').eq(i);
            var modal = document.getElementById('myModal');
            var modalImg = document.getElementById("img01");
            var captionText = document.getElementById("caption");
            image.on("click", function () {
                cap = $("table tbody td").eq(0).text();
                modal.style.display = "block";
                modalImg.src = this.src;
            });
            //Fecha Modal
            var span = document.getElementsByClassName("close")[0];
            span.onclick = function () {
                modal.style.display = "none";
            }
        }
    }
};

function excluir(index) {
    if (!confirm("Deseja realmente excluir?"))
        return false;
    skins.splice(index, 1);
    localStorage.setItem("tbSkin", JSON.stringify(skins));
    atualizaSkin();
};

var indexSkinSelecionada;

function exibeSkin(index) {
    indexSkinSelecionada = index;
    salvarEditar = "E";
    get("btnCadastrar").attr("value", "Atualizar");
    get("txtNomeSkin").val(skins[index].Nome);
    get("txtValor").val(skins[index].Valor);
    get("cmbEstado").find(":selected").text(skins[index].NomeEst);
    get("divFormulario").slideDown();
    get("imgPreview").attr("src", skins[index].UrlImg);
};

function cancelarUpd() {
    get("divFormulario").slideUp();
    limpaCampos();
};
function buscar() {
    var pesquisaValor = get("txtValorPesq").val();
    if (pesquisaValor == "") {
        atualizaSkin();
        get("tbGrid").show();
    }

    $('table tbody tr').hide();
    $('table tbody tr td[data-valor]').each(function () {
        var texto = $(this).text();
        if (texto.indexOf(pesquisaValor) >= 0) {
            get("divGrid").slideDown();
            $(this).closest('tr').show();
        }
    });
};

function limpaCampos() {
    get("txtNomeSkin").val('');
    get("txtValor").val('');
    get("imgSkin").val('');
};

$("#imgSkin").change(function () {
    var input = document.getElementById("imgSkin").files[0];
    getBase64(input);
});


