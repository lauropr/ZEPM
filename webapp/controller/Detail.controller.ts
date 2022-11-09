import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import OverviewTile from "sap/ca/ui/OverviewTile";

/**
 * @namespace tra03.epm.controller
 */
export default class Detail extends Controller {

    public onInit(): void {

        this.inicializarModelosLocais();

        //resgata o Roteador
        let oRouter = this.getOwnerComponent().getRouter();

        //resgata o Modelo
        let oModel = this.getOwnerComponent().getModel();

        //resgata a View
        let oView = this.getView();

        let oController = this;

        //acessa a rota de detalhe, anexa o event patternMatched e declara função de callback para quando o evento for chamado
        oRouter.getRoute("RotaDetalhe").attachPatternMatched(function(oEvent){

            //acessa o nome da rota
            let sRota = oEvent.getParameter("name");

            if(sRota === "RotaDetalhe"){
                oController.setarControlesEditaveis(false);
            }

            //acessa os argumentos do Evento
            let oArgumentos = oEvent.getParameter("arguments");

            //acessa o PartnerId
            let iPartnerId = oArgumentos.PartnerId;

            //gera o caminho do modelo
            let sCaminho = oModel.createKey("/BusinessPartners", {
                PartnerId: iPartnerId
            });

            oView.bindElement(sCaminho);

        });

        oRouter.getRoute("RotaAdicionar").attachPatternMatched(function(oEvent){

            //habilita modelo de edicao 
            this.setarPropriedadeModelo("edicao", "/visible", true);

            //desabilita modelo de visualizacao 
            this.setarPropriedadeModelo("visualizacao", "/visible", false);

            this.setarPropriedadeModelo("editavel", "/editavel", true);

            var oContext = oModel.createEntry("/BusinessPartners", {
                properties: {
                    PartnerId: "",
                    PartnerType: "",
                    PartnerName1: "",
                    PartnerName2: "",
                    SearchTerm1: "",
                    SearchTerm2: "",
                    Street: "",
                    HouseNumber: "",
                    District: "",
                    City: "",
                    Region: "",
                    ZipCode: "",
                    Country: ""
                }
            });
            oView.bindElement(oContext.getPath());
        }.bind(this));

    }

    public inicializarModelosLocais(): void {

        //inicializa um modelo local, cria uma propriedade assinalando o valor falso que controlará visibilidade
        var oModeloEdicao = new JSONModel();
        oModeloEdicao.setProperty("/visible", false);
        this.getView().setModel(oModeloEdicao, "edicao");

        var oModeloVisualizacao = new JSONModel();
        oModeloVisualizacao.setProperty("/visible", true);
        this.getView().setModel(oModeloVisualizacao, "visualizacao");


    }

    public setarControlesEditaveis(bValor): void {
        
        var sPath ;
        let oModel = new JSONModel();

        //se verdadeiro
        if(bValor){
            //carrega modelo a partir do arquivo controlesAbertos
            oModel.loadData('./model/controlesAbertos.json');
        }
        //se falso
        else{
            //carrega modelo a partir do arquivo controlesFechados
            oModel.loadData('./model/controlesFechados.json');
            
        }

        this.getView().setModel(oModel, "editavel");

    }

    public aoEditar(oEvent): void {

        //habilita modelo de edicao 
        this.setarPropriedadeModelo("edicao", "/visible", true);

        //desabilita modelo de visualizacao 
        this.setarPropriedadeModelo("visualizacao", "/visible", false);

        this.setarPropriedadeModelo("editavel", "/editavel", true);

        //grava caminho c/ dados originais, caso edicao seja cancelada
        this.sCaminhoDadosOriginais = this.getView().getBindingContext().getPath();

    }

    public aoCancelar(oEvent): void {

        MessageBox.show("Deseja cancelar a edição?", {
            title: "Cancelamento de edição",
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function(oAction){
                if(oAction === MessageBox.Action.YES){
                    //habilita modelo de edicao 
                    this.setarPropriedadeModelo("edicao", "/visible", false);

                    //desabilita modelo de visualizacao 
                    this.setarPropriedadeModelo("visualizacao", "/visible", true);

                    this.setarPropriedadeModelo("editavel", "/editavel", false);

                    var oView = this.getView();
                    var oModel = oView.getModel();
                    var aPaths = [this.sCaminhoDadosOriginais];
                    oModel.resetChanges(aPaths);
                }
            }.bind(this)
        })

    }

    public aoSalvar(oEvent): void{

        var oForm = this.getView().byId("FormParceiro");
        oForm.setBusy(true);
        
        var oContextoVinculo = this.getView().getBindingContext();
        var oDadosAtualizacao = oContextoVinculo.getObject();
        var sCaminho = oContextoVinculo.getPath();
        var oModel = this.getView().getModel();
        var oRouter = this.getOwnerComponent().getRouter();

        if(oDadosAtualizacao.PartnerId){

        oModel.update(sCaminho, oDadosAtualizacao, {
            success: function(oData) {
                //habilita modelo de edicao 
                this.setarPropriedadeModelo("edicao", "/visible", false);
                //desabilita modelo de visualizacao 
                this.setarPropriedadeModelo("visualizacao", "/visible", true);
                this.setarPropriedadeModelo("editavel", "/editavel", false);
                MessageToast.show("Atualização do parceiro " + oDadosAtualizacao.PartnerId + " feita com successo!");
                oModel.updateBindings(true);
                oForm.setBusy(false);

            }.bind(this),
            error: function(oError){
                MessageBox.error("Erro ao atualizar parceiro " + oDadosAtualizacao.PartnerId);
                oForm.setBusy(false);
            }.bind(this),
            refreshAfterChange: true
        });

        } else{
			oModel.setHeaders({'X-Requested-With': 'X'});
            oModel.create("/BusinessPartners", oDadosAtualizacao, {
                success: function(oData){
                    MessageToast.show("Parceiro " + oDadosAtualizacao.PartnerId + " criado!");
                    oForm.setBusy(false);
                    oRouter.navTo("RouteMaster", true);
                }.bind(this),
                error: function(oData){
                    MessageBox.error("Erro ao atualizar parceiro " + oDadosAtualizacao.PartnerId);
                    oForm.setBusy(false);    
                }
            });

        }
    }

    public aoDigitarCEP(oEvent){
        var sCEP = oEvent.getParameter("value");
        if(sCEP.length !== 9){
            oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
        }else{
            oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
        }
    }

    public setarPropriedadeModelo(sModelo, sPropriedade, sValor): void {
        var oModel = this.getView().getModel(sModelo);
        if(oModel){
            oModel.setProperty(sPropriedade, sValor);
        }
    }

}   