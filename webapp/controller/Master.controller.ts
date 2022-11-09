import Controller from "sap/ui/core/mvc/Controller";

/**
 * @namespace tra03.epm.controller
 */
export default class Master extends Controller {

    public onInit(): void {

    }

    public aoPressionarItem(oEvent): void {
        
        //novo comentario

        //resgatar a coluna clicada
        let oColumnListItem = oEvent.getSource();

        // resgata o binding da coluna clicada. O Modelo não tem nome, então o getBindingContext fica sem parâmetro
        let oItem = oColumnListItem.getBindingContext().getObject();

        // resgata o ID do parceiro
        let iPartnerId = oItem.PartnerId;

        //resgata o Roteador
        let oRouter = this.getOwnerComponent().getRouter();

        //navega p/ rota de detalhe
        oRouter.navTo("RotaDetalhe", {
            PartnerId: iPartnerId
        });

    }

    public aoAdicionar(oEvent): void{
        //resgata o Roteador
        let oRouter = this.getOwnerComponent().getRouter();

        //navega p/ rota de detalhe
        oRouter.navTo("RotaAdicionar");
        
    }

}