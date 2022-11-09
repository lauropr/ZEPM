import BaseComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "./model/models";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace tra03.epm
 */
export default class Component extends BaseComponent {

	public static metadata = {
		manifest: "json"
	};

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
	public init() : void {
		// call the base component's init function
		super.init();

        // set the device model
        this.setModel(createDeviceModel(), "device");

        // enable routing
        this.getRouter().initialize();

        // //novo modelo para a propriedade layout
        // let oModel = new JSONModel();
        // this.setModel(oModel);

        // //resgata o Roteador
        // let oRouter = this.getRouter();

        // //antes de qualquer roteamento, inicializar com layout de uma coluna

        // //alternativa
        // // oRouter.attachBeforeRouteMatched(function(oEvent){
        // //     debugger;
        // // });

        // oRouter.attachBeforeRouteMatched((oEvent) => {
        //     oModel.setProperty("/layout", sap.f.LayoutType.OneColumn);
        // });


	}
}