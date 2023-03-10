/*
 * File: recibos_ed.js
 * Date: Mon Feb 28 2011 20:31:14 GMT+0100 (CET)
 * 
 * This file was generated by Ext Designer version xds-1.0.3.2.
 * http://www.extjs.com/products/designer/
 *
 * This file will be generated the first time you export.
 *
 * You should implement event handling and custom methods in this
 * class.
 */

function validar_dc(banco, sucursal, dc, cuenta) {
  var nosepuede=0;
  if (banco == ""  || sucursal == "" || dc == "" || cuenta == "") {
    nosepuede=1;
	return false;
  } else {
    if (banco.length != 4 || sucursal.length != 4 || dc.length != 2 || cuenta.length != 10) {
      nosepuede=2;
	  return false;
  } else {
      if (!numerico(banco) || !numerico(sucursal) || !numerico(dc) || !numerico(cuenta)) {
	    return false;
        nosepuede=3;
	  } else {
        if (!(obtenerDigito("00" + banco + sucursal) == parseInt(dc.charAt(0))) || !(obtenerDigito(cuenta) == parseInt(dc.charAt(1))))
          Ext.Msg.show({ title: '¡Error!', msg: 'Los dígitos de control no se corresponden con la cuenta indicada', buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR}); 
		else return true;
      } 
    }
  }
}

// Validar IBAN

// Variables	
    var NON_ALPHANUM = /[^a-zA-Z0-9]/g,
        EVERY_FOUR_CHARS =/(.{4})(?!$)/g;
	var A = 'A'.charCodeAt(0),
        Z = 'Z'.charCodeAt(0);		

    // Clase Specification donde definimos como se construye cada IBAN de cada páis    
	function Specification(countryCode, length, structure, example){
        this.countryCode = countryCode;
        this.length = length;
        this.structure = structure;
        this.example = example;
    }

    function parseStructure(structure){
        // split in blocks of 3 chars
        var regex = structure.match(/(.{3})/g).map(function(block){
            // parse each structure block (1-char + 2-digits)
            var format,
                pattern = block.slice(0, 1),
                repeats = parseInt(block.slice(1), 10);
            switch (pattern){
                case "A": format = "0-9A-Za-z"; break;
                case "B": format = "0-9A-Z"; break;
                case "C": format = "A-Za-z"; break;
                case "F": format = "0-9"; break;
                case "L": format = "a-z"; break;
                case "U": format = "A-Z"; break;
                case "W": format = "0-9a-z"; break;
            }
            return '([' + format + ']{' + repeats + '})';
        });
        return new RegExp('^' + regex.join('') + '$');
    }

	function iso13616Prepare(iban) {
        iban = iban.toUpperCase();
        iban = iban.substr(4) + iban.substr(0,4);
        return iban.split('').map(function(n){
            var code = n.charCodeAt(0);
            if (code >= A && code <= Z){
                // A = 10, B = 11, ... Z = 35
                return code - A + 10;
            } else {
                return n;
            }
        }).join('');
    }

    function iso7064Mod97_10(iban) {
        var remainder = iban,
            block;
        while (remainder.length > 2){
            block = remainder.slice(0, 9);
            remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
        }
        return parseInt(remainder, 10) % 97;
    }	
	
	Specification.prototype._regex = function(){
        return this._cachedRegex || (this._cachedRegex = parseStructure(this.structure))
    };

    Specification.prototype.isValid = function(iban){
        var resultado;
		var viban;
		
		resultado = this.length == iban.length;
		resultado = resultado && this.countryCode === iban.slice(0,2);
		resultado = resultado && this._regex().test(iban.slice(4));
		viban = iso13616Prepare(iban);
		resultado = resultado && iso7064Mod97_10(viban) == 1;
		return resultado;
    };
	
    var countries = {};

    function addSpecification(IBAN){
        countries[IBAN.countryCode] = IBAN;
    }
    // paises
    addSpecification(new Specification("AD", 24, "F04F04A12",          "AD1200012030200359100100"));
    addSpecification(new Specification("AE", 23, "F03F16",             "AE070331234567890123456"));
    addSpecification(new Specification("AL", 28, "F08A16",             "AL47212110090000000235698741"));
    addSpecification(new Specification("AT", 20, "F05F11",             "AT611904300234573201"));
    addSpecification(new Specification("AZ", 28, "U04A20",             "AZ21NABZ00000000137010001944"));
    addSpecification(new Specification("BA", 20, "F03F03F08F02",       "BA391290079401028494"));
    addSpecification(new Specification("BE", 16, "F03F07F02",          "BE68539007547034"));
    addSpecification(new Specification("BG", 22, "U04F04F02A08",       "BG80BNBG96611020345678"));
    addSpecification(new Specification("BH", 22, "U04A14",             "BH67BMAG00001299123456"));
    addSpecification(new Specification("BR", 29, "F08F05F10U01A01",    "BR9700360305000010009795493P1"));
    addSpecification(new Specification("CH", 21, "F05A12",             "CH9300762011623852957"));
    addSpecification(new Specification("CR", 21, "F03F14",             "CR0515202001026284066"));
    addSpecification(new Specification("CY", 28, "F03F05A16",          "CY17002001280000001200527600"));
    addSpecification(new Specification("CZ", 24, "F04F06F10",          "CZ6508000000192000145399"));
    addSpecification(new Specification("DE", 22, "F08F10",             "DE89370400440532013000"));
    addSpecification(new Specification("DK", 18, "F04F09F01",          "DK5000400440116243"));
    addSpecification(new Specification("DO", 28, "U04F20",             "DO28BAGR00000001212453611324"));
    addSpecification(new Specification("EE", 20, "F02F02F11F01",       "EE382200221020145685"));
    addSpecification(new Specification("ES", 24, "F04F04F01F01F10",    "ES9121000418450200051332"));
    addSpecification(new Specification("FI", 18, "F06F07F01",          "FI2112345600000785"));
    addSpecification(new Specification("FO", 18, "F04F09F01",          "FO6264600001631634"));
    addSpecification(new Specification("FR", 27, "F05F05A11F02",       "FR1420041010050500013M02606"));
    addSpecification(new Specification("GB", 22, "U04F06F08",          "GB29NWBK60161331926819"));
    addSpecification(new Specification("GE", 22, "U02F16",             "GE29NB0000000101904917"));
    addSpecification(new Specification("GI", 23, "U04A15",             "GI75NWBK000000007099453"));
    addSpecification(new Specification("GL", 18, "F04F09F01",          "GL8964710001000206"));
    addSpecification(new Specification("GR", 27, "F03F04A16",          "GR1601101250000000012300695"));
    addSpecification(new Specification("GT", 28, "A04A20",             "GT82TRAJ01020000001210029690"));
    addSpecification(new Specification("HR", 21, "F07F10",             "HR1210010051863000160"));
    addSpecification(new Specification("HU", 28, "F03F04F01F15F01",    "HU42117730161111101800000000"));
    addSpecification(new Specification("IE", 22, "U04F06F08",          "IE29AIBK93115212345678"));
    addSpecification(new Specification("IL", 23, "F03F03F13",          "IL620108000000099999999"));
    addSpecification(new Specification("IS", 26, "F04F02F06F10",       "IS140159260076545510730339"));
    addSpecification(new Specification("IT", 27, "U01F05F05A12",       "IT60X0542811101000000123456"));
    addSpecification(new Specification("KW", 30, "U04A22",             "KW81CBKU0000000000001234560101"));
    addSpecification(new Specification("KZ", 20, "F03A13",             "KZ86125KZT5004100100"));
    addSpecification(new Specification("LB", 28, "F04A20",             "LB62099900000001001901229114"));
    addSpecification(new Specification("LI", 21, "F05A12",             "LI21088100002324013AA"));
    addSpecification(new Specification("LT", 20, "F05F11",             "LT121000011101001000"));
    addSpecification(new Specification("LU", 20, "F03A13",             "LU280019400644750000"));
    addSpecification(new Specification("LV", 21, "U04A13",             "LV80BANK0000435195001"));
    addSpecification(new Specification("MC", 27, "F05F05A11F02",       "MC5811222000010123456789030"));
    addSpecification(new Specification("MD", 24, "U02F18",             "MD24AG000225100013104168"));
    addSpecification(new Specification("ME", 22, "F03F13F02",          "ME25505000012345678951"));
    addSpecification(new Specification("MK", 19, "F03A10F02",          "MK07250120000058984"));
    addSpecification(new Specification("MR", 27, "F05F05F11F02",       "MR1300020001010000123456753"));
    addSpecification(new Specification("MT", 31, "U04F05A18",          "MT84MALT011000012345MTLCAST001S"));
    addSpecification(new Specification("MU", 30, "U04F02F02F12F03U03", "MU17BOMM0101101030300200000MUR"));
    addSpecification(new Specification("NL", 18, "U04F10",             "NL91ABNA0417164300"));
    addSpecification(new Specification("NO", 15, "F04F06F01",          "NO9386011117947"));
    addSpecification(new Specification("PK", 24, "U04A16",             "PK36SCBL0000001123456702"));
    addSpecification(new Specification("PL", 28, "F08F16",             "PL61109010140000071219812874"));
    addSpecification(new Specification("PS", 29, "U04A21",             "PS92PALS000000000400123456702"));
    addSpecification(new Specification("PT", 25, "F04F04F11F02",       "PT50000201231234567890154"));
    addSpecification(new Specification("RO", 24, "U04A16",             "RO49AAAA1B31007593840000"));
    addSpecification(new Specification("RS", 22, "F03F13F02",          "RS35260005601001611379"));
    addSpecification(new Specification("SA", 24, "F02A18",             "SA0380000000608010167519"));
    addSpecification(new Specification("SE", 24, "F03F16F01",          "SE4550000000058398257466"));
    addSpecification(new Specification("SI", 19, "F05F08F02",          "SI56263300012039086"));
    addSpecification(new Specification("SK", 24, "F04F06F10",          "SK3112000000198742637541"));
    addSpecification(new Specification("SM", 27, "U01F05F05A12",       "SM86U0322509800000000270100"));
    addSpecification(new Specification("TN", 24, "F02F03F13F02",       "TN5910006035183598478831"));
    addSpecification(new Specification("TR", 26, "F05A01A16",          "TR330006100519786457841326"));
    addSpecification(new Specification("VG", 24, "U04F16",             "VG96VPVG0000012345678901"));
    // paises
	
	// Vamos con las funciones para comprobar un IBAN
    
	function isString(v){
        return (typeof v == 'string' || v instanceof String);
    }
	
	function electronicFormatIBAN(iban){
        return iban.replace(NON_ALPHANUM, '').toUpperCase();
    };

    function isValidIBAN(iban){
        
		if (!isString(iban)){
            return false;
        }
		
        iban = electronicFormatIBAN(iban);
		//alert(iban);
        var countryStructure = countries[iban.slice(0,2)];
		//alert(countryStructure.countryCode + ' ' + countryStructure.length + ' ' + countryStructure.structure + ' ' + countryStructure.example);
        return !!countryStructure && countryStructure.isValid(iban);
		
    };	
	
        function CalcularIBAN(numerocuenta, codigopais) {          
            if (codigopais.length != 2)
                return "";
            else {
                var numerocuentaOrig = numerocuenta;
				var Aux;
                var CaracteresSiguientes;
                var TmpInt;
                var CaracteresSiguientes;
                numerocuenta = numerocuenta + (codigopais.charCodeAt(0) - 55).toString() + (codigopais.charCodeAt(1) - 55).toString() + "00";
                //Hay que calcular el módulo 97 del valor contenido en número de cuenta
                //Como el número es muy grande vamos calculando módulos 97 de 9 en 9 dígitos
                //Lo que se hace es calcular el módulo 97 y al resto se le añaden 7 u 8 dígitos en función de que el resto sea de 1 ó 2 dígitos
                //Y así sucesivamente hasta tratar todos los dígitos
                TmpInt = parseInt(numerocuenta.substring(0, 9), 10) % 97;
                if (TmpInt < 10) Aux = "0";
                else Aux = "";
                Aux=Aux + TmpInt.toString();
                numerocuenta = numerocuenta.substring(9);
                while (numerocuenta!="") {
                    if (parseInt(Aux, 10) < 10)
                        CaracteresSiguientes = 8;
                    else
                        CaracteresSiguientes = 7;
                    if (numerocuenta.length<CaracteresSiguientes) {
                        Aux=Aux + numerocuenta;
                        numerocuenta="";
                    }
                    else {
                        Aux=Aux + numerocuenta.substring(0, CaracteresSiguientes);
                        numerocuenta=numerocuenta.substring(CaracteresSiguientes);
                    }
                    TmpInt = parseInt(Aux, 10) % 97;
                    if (TmpInt < 10)
                        Aux = "0";
                    else
                        Aux = "";
                    Aux=Aux + TmpInt.toString();
                }
                TmpInt = 98 - parseInt(Aux, 10);
                if (TmpInt<10)
                    return codigopais + "0" + TmpInt.toString() + numerocuentaOrig;
                else
                    return codigopais + TmpInt.toString() + numerocuentaOrig;
            }
        }	

function Busca_Recibo(win, cual) {
	win.form_recibos.getForm().load({
	url:'modules/fichas/server/colectores/recibo.php', 
	params:{'id_recibos': cual},
	success: function(form,action) 
	{
		// actualizamos la cabecera
		/*nombre_completo = win.edt_nombre.getRawValue() + ' ' + win.edt_apellidos.getRawValue();
		codigo = win.edt_id_hermanos.getValue();
		numero_actual = win.edt_numero_actual.getValue();
		fecha_alta = win.dtp_fecha_alta.getRawValue();
		fecha_baja = win.dtp_fecha_baja.getRawValue();
		titulo = 'Ficha Hermanos - [Nombre: ' + nombre_completo + '] [Código: ' + codigo + '] [Número Actual: ' + numero_actual + '] [Fecha Alta: ' + fecha_alta + ']';
		if (fecha_baja != '') titulo = titulo + ' [Fecha Baja: ' + fecha_baja + ']';
		win.setTitle(titulo);*/
		if (win.devolver == 1) {
			//win.chk_devuelto.setValue(true);
			if (win.edt_devuelto.getValue()=='') win.edt_devuelto.setValue('1');
			else win.edt_devuelto.setValue(parseInt(win.edt_devuelto.getValue())+1);
			win.edt_cobrado.setValue(0);
			win.dtp_fecha_devolucion.setValue(new Date());
			win.chk_enviado.setValue(false);
			win.edt_motivo_devolucion.focus(false,500);
		}
		if (win.edt_devuelto.getValue()!='' && win.edt_devuelto.getValue()>0) {
			win.dtp_fecha_devolucion.setDisabled(false);
			win.edt_motivo_devolucion.setDisabled(false);
		} else {
			win.dtp_fecha_devolucion.setDisabled(true);
			win.edt_motivo_devolucion.setDisabled(true);		
		}
	},
	failure: function(form,action)
	{
		Ext.Msg.show({
			title: 'Error!',
			msg: 'Ha ocurrido un error al intentar recuperar los datos del servidor: ' + action.failureType,
			buttons: Ext.Msg.OK,
			icon: Ext.Msg.ERROR}); 
	}
  });
};

function rcb_form_Show()
{
	if (this.id_recibos != 0) {
		// estamos editando un recibo
	 	Busca_Recibo(this,this.id_recibos);
		if (this.devolver != 1) 
			this.edt_cobrado.focus(false,500);
		
	} else {
		// estamos creando un recibo, establecemos los valores por defecto
		hoy=new Date(); 		
		this.edt_id_recibos.setValue(this.id_recibos);
		this.edt_id_hermanos.setValue(this.id_hermanos);
		this.edt_iban.setValue(this.iban);		
		this.dtp_fecha_recibo.setValue(hoy);
		this.dtp_fecha_inicio.setValue(hoy);
		this.dtp_fecha_fin.setValue(hoy);
		this.dtp_fecha_devolucion.setDisabled(true);
		this.edt_motivo_devolucion.setDisabled(true);		
		this.edt_concepto.focus(false,500);		
	}
}

function rcb_btn_Guardar_Click() 
{
	// Actualizamos / Insertamos el registro
	win = this;
	win.edt_id_recibos.setDisabled(false);
	win.form_recibos.getForm().submit({ 
		method: 'POST',
		waitTitle: 'Operación en curso',
		waitMsg: 'Grabando Recibo...',	
		success: function(form,action){
			win.edt_id_recibos.setDisabled(true);
			obj = Ext.util.JSON.decode(action.response.responseText);
			Ext.Msg.show({title: 'Operación Finalizada',msg: obj.msg,buttons: Ext.Msg.OK,icon: Ext.Msg.INFO});
			// actualizamos la rejilla de datos a través de una llamada
			win.app.makeRequest('fichas-hermanos', {
			   requests: [{
				  action: 'refrescarRejilla',
				  params: '',
				  callback: function(){win.close();},
				  scope: win
			   }]
			});	
		}, 
		failure: function(form,action){
			win.edt_id_recibos.setDisabled(true);
			if (action.failureType == 'server') {
				obj = Ext.util.JSON.decode(action.response.responseText);
				Ext.Msg.show({title: 'Inténtelo de nuevo',msg: obj.errors.reason,buttons: Ext.Msg.OK,icon: Ext.Msg.ERROR}) 
			} else if (action.failureType == "client") {					
				Ext.Msg.show({title: 'Inténtelo de nuevo',msg: 'Error al grabar. Revise los datos.',buttons: Ext.Msg.OK,icon: Ext.Msg.ERROR}) 
			} else {
				Ext.Msg.alert('Ouch!','el servidor no contesta : ' + action.response.responseText)
			}
		}
		,	submitEmptyText: false
	});	
}

function rcb_btn_Cancelar_Click()
{
	this.close();
}

function rcb_chk_Devuelto_Check(field, checked) 
{
	win = this;
	if (checked) {
		win.dtp_fecha_devolucion.setDisabled(false);
		win.edt_motivo_devolucion.setDisabled(false);
	} else {
		win.dtp_fecha_devolucion.setDisabled(true);
		win.edt_motivo_devolucion.setDisabled(true);
		win.dtp_fecha_devolucion.setValue('');
		win.edt_motivo_devolucion.setValue('');
	}					
}

function rcb_edt_Devuelto_Blur(field) 
{
	win = this;
	if (field.getValue()!='' && field.getValue()>0) {
		win.dtp_fecha_devolucion.setDisabled(false);
		win.edt_motivo_devolucion.setDisabled(false);
	} else {
		win.dtp_fecha_devolucion.setDisabled(true);
		win.edt_motivo_devolucion.setDisabled(true);
		win.dtp_fecha_devolucion.setValue('');
		win.edt_motivo_devolucion.setValue('');
	}				
}

function rcb_edt_IBAN_Blur(field) 
{
	//validar_dc(this.edt_cuenta_banco.getValue().substring(0,4), this.edt_cuenta_banco.getValue().substring(4,8), this.edt_cuenta_banco.getValue().substring(8,10), this.edt_cuenta_banco.getValue().substring(10,21));
    if (!isValidIBAN(this.edt_iban.getValue())) {
		Ext.Msg.show({ title: '¡Error!', msg: 'El IBAN introducido no es correcto', buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR}); 
	}	
}


recibos_ed = Ext.extend(recibos_edUi, {
    initComponent: function() {
        recibos_ed.superclass.initComponent.call(this);
		this.on('show',this.on_Form_Show,this);		
		this.btn_guardar.on('click', this.on_Btn_Guardar_Click, this);
		this.btn_cancelar.on('click', this.on_Btn_Cancelar_Click, this);
		this.edt_devuelto.on('blur',this.on_Edt_Devuelto_Blur,this);				
		this.edt_iban.on('blur',this.on_Edt_IBAN_Blur,this);						
		//this.chk_devuelto.on('check',this.on_Chk_Devuelto_Check,this);
    },
	on_Form_Show: rcb_form_Show,
	on_Btn_Guardar_Click: rcb_btn_Guardar_Click,
	on_Btn_Cancelar_Click : rcb_btn_Cancelar_Click,
	on_Edt_Devuelto_Blur : rcb_edt_Devuelto_Blur,
	on_Edt_IBAN_Blur : rcb_edt_IBAN_Blur	
	//,on_Chk_Devuelto_Check : rcb_chk_Devuelto_Check
});



