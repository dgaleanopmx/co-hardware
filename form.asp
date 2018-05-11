<%@LANGUAGE="VBSCRIPT" CODEPAGE=65001%><% Response.CharSet = "utf-8" %><% 
Response.AddHeader "Content-Type", "text/html;charset=UTF-8"
	pagename = "form.asp"
	%><!--#INCLUDE FILE = "includes/set.asp" --><%
	pagetitle = "Reciclaje de computadores"
	
	pagetagline = ""
	
	if Request.Form.Count > 0 then
		
		errStr = ""
				
		if not ValidateTags(Request.Form("company_name")) and trim(Request.Form("company_name")) <> ""  then
			Session("company_name") = trim(Request.Form("company_name"))
						
		else
			Session("company_name") = ""
			
		end if
		if not ValidateTags(Request.Form("contact_name")) and trim(Request.Form("contact_name")) <> ""  then
			Session("contact_name") = trim(Request.Form("contact_name"))
						
		else
			Session("contact_name") = ""
			
		end if
		if not ValidateTags(Request.Form("phone")) and trim(Request.Form("phone")) <> ""  then
			Session("phone") = trim(Request.Form("phone"))
						
		else
			Session("phone") = ""
			
		end if
		if not ValidateTags(Request.Form("email")) and trim(Request.Form("email")) <> ""  then
			Session("email") = trim(Request.Form("email"))
						
		else
			Session("email") = ""
			
		end if
		if not ValidateTags(Request.Form("address1")) and trim(Request.Form("address1")) <> ""  then
			Session("address1") = trim(Request.Form("address1"))
						
		else
			Session("address1") = ""
			
		end if
		if not ValidateTags(Request.Form("address2")) and trim(Request.Form("address2")) <> ""  then
			Session("address2") = trim(Request.Form("address2"))
						
		else
			Session("address2") = ""
			
		end if
		if not ValidateTags(Request.Form("address3")) and trim(Request.Form("address3")) <> ""  then
			Session("address3") = trim(Request.Form("address3"))
						
		else
			Session("address3") = ""
			
		end if
		if not ValidateTags(Request.Form("desc")) and trim(Request.Form("desc")) <> ""  then
			Session("desc") = trim(Request.Form("desc"))
						
		else
			Session("desc") = ""
			
		end if
		if not ValidateTags(Request.Form("transport")) and trim(Request.Form("transport")) <> ""  then
			Session("transport") = trim(Request.Form("transport"))
						
		else
			Session("transport") = ""
			
		end if
		if not ValidateTags(Request.Form("packing")) and trim(Request.Form("packing")) <> ""  then
			Session("packing") = trim(Request.Form("packing"))
						
		else
			Session("packing") = ""
			
		end if
		if not ValidateTags(Request.Form("certificate")) and trim(Request.Form("certificate")) <> ""  then
			Session("certificate") = trim(Request.Form("certificate"))
						
		else
			Session("certificate") = ""
			
		end if
		if not ValidateTags(Request.Form("serial")) and trim(Request.Form("serial")) <> ""  then
			Session("serial") = trim(Request.Form("serial"))
						
		else
			Session("serial") = ""
			
		end if
		
		if errstr = "" then
		
		theSchema="http://schemas.microsoft.com/cdo/configuration/"
		Set cdoConfig=server.CreateObject("CDO.Configuration")
		cdoConfig.Fields.Item(theSchema & "sendusing")= 2
		cdoConfig.Fields.Item(theSchema & "smtpserver")=Application("mailserver")
		cdoConfig.Fields.Update
		
				
		'send the contact mail
		set cdoMessage=Server.CreateObject("CDO.Message")
		cdoMessage.Configuration=cdoConfig
		cdoMessage.From="no-reply@" & Application("Host")
		
			cdoMessage.To=Application("co_contact")
		
		
		cdoMessage.Subject= "Message from HP Colombia Hardware Recycling" 
			
		strBody = vbCrLf & "Empresa o razón social : " & Session("company_name") & vbCrLf 
		strBody = strBody & "Nombre de contacto : " & Session("contact_name") & vbCrLf
		strBody = strBody & "Teléfono: " & Session("phone") & vbCrLf
		strBody = strBody & "Correo electrónico: " & Session("email") & vbCrLf
		strBody = strBody & "Dirección(es) de la ubicación del equipo(s): " & Session("address1") & vbCrLf
		strBody = strBody & " " & Session("address2") & vbCrLf
		strBody = strBody & " " & Session("address3") & vbCrLf & vbCrLf
		strBody = strBody & "Inventario de equipos a reciclar: " & Session("desc") & vbCrLf & vbCrLf
		strBody = strBody & "¿Requiere transporte?: " & Session("transport") & vbCrLf
		strBody = strBody & "¿Requiere embalaje?: " & Session("packing") & vbCrLf
		strBody = strBody & "¿Requiere  un certificado de destrucción?: " & Session("certificate")  & vbCrLf
		strBody = strBody & "¿Requiere una lista de números de serie de artículos reciclados?: " &  Session("serial") & vbCrLf & vbCrLf
			
		
		
		strBody = strBody & "This is an automated message."
			
		cdoMessage.TextBody= strBody
		cdoMessage.Send 

		Set cdoMessage=Nothing

		
		
		Set cdoConfig=Nothing 
	
		Response.redirect "thanks.asp" 
		
		end if
		
		
	end if 'form submit
	
	
%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="<%=HTMLEncode(Session("la"))%>-<%=HTMLEncode(Session("cc"))%>" xml:lang="<%=HTMLEncode(Session("la"))%>-<%=HTMLEncode(Session("cc"))%>">
<head>

	<title>Reciclaje de computadores</title>
	
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
    <meta content="text/javascript" http-equiv="Content-Script-Type"/>
    <meta content="text/css" http-equiv="Content-Style-Type"/>
    <!--<meta content="IE=7" http-equiv="X-UA-Compatible"/>-->
    <meta content="Shared" name="bu" />
    <meta content="applied_use" name="lifecycle" />
    <meta content="<%=HTMLEncode(Session("cc"))%>" name="target_country" />
	<meta name="web_section_id" content="R2612">
    <meta content="hpcleansheetnontridion" name="hp_design_version" />
	<meta name="page_content" content="Solutions">
	<meta name="segment" content="hho">
	<meta name="user_type" content="any">
	<meta name="product_service_name" content="EC">
	<meta name="lifecycle" content="applied_use">
	<meta name="Keywords" content="">
	<meta name="Description" content="">
	<meta content="follow, index" name="robots" />
    <meta content="All" name="product_service_name" />
    <meta content="Consumer" name="user_profile" />
    <meta content="Products" name="page_content"/> 
	<!-- END METADATA -->
    <link href="http://www8.hp.com/us/en/images/i/favicon.ico" rel="shortcut icon" type="image/x-icon"/>
    <!-- BEGIN STYLES -->
    
    
    <!--hpe-->

<link href="system/styles/hps-euro-fontface-core.css" media="screen" rel="stylesheet" type="text/css"/>
<link href="system/styles/ui-core-min-v2-hpe.css" media="screen" rel="stylesheet" type="text/css"/>
<link href="system/styles/molecules.css" media="screen" rel="stylesheet" type="text/css"/>
<!--<script src="scripts/external/mootools-core-1.4.5-full-compat.js" type="text/javascript"></script>
<script src="scripts/external/mootools-more-1.4.0.1.js" type="text/javascript"></script>-->

<link href="system/styles/service/index.css" media="screen" rel="stylesheet" type="text/css"/>

<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/layout-grid-studio.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/buttons.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/icons.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/link-lists.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/video.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/lightbox.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/table-sortable.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/typography.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/typography-margins.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/divider.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/forms.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/checkboxes.css">



<!--[if IE]>
<link href="system/styles/molecules-ie.css" media="screen" rel="stylesheet" type="text/css"/>
<link href="system/styles/patterns/video-ie.css" media="screen" rel="stylesheet" type="text/css"/>
<link href="system/styles/patterns/lightbox-ie.css" media="screen" rel="stylesheet" type="text/css"/>
<![endif]-->
<!--[if IE 6]>
<script src="scripts/common/common-ie6.js" type="text/javascript">//</script>
<![endif]-->
    <!--/hpe-->
    
    <!--<link href="styles/hf-core.css" media="screen" type="text/css" rel="stylesheet"/>
	<link href="styles/cs1.1.css" media="screen" rel="stylesheet" type="text/css"/>-->
	<!--<link href="styles/hpe-fonts.css" media="screen" rel="stylesheet" type="text/css"/>-->
	<link href="styles/append-hpe.css" media="screen" rel="stylesheet" type="text/css"/>
	<link href="styles/printing.css" media="print" rel="stylesheet" type="text/css"/>
    
    <!-- END STYLES -->
    <!-- BEGIN JAVASCRIPT -->
    <!-- BEGIN HEADER/FOOTER WEB SERVICE -->
		<script type="text/javascript" src="<%=tridionhost%>/ww/en/scripts/framework/mootools/v-1-4/mootools-core-compat.js"></script>
		<script type="text/javascript" src="<%=tridionhost%>/ww/en/scripts/framework/mootools/v-1-4/mootools-more-full-compat.js"></script>
		<!--<script type="text/javascript" src="<%=tridionhost%>/ww/en/scripts/hfws/hfws.js"></script>-->
		
		<!-- END HEADER/FOOTER WEB SERVICE -->
		<!--<script src="scripts/utilities-core-hpe.js" type="text/javascript"></script>-->
		<script src="scripts/iframe_standard.js" type="text/javascript"></script>
		<!--<script src="scripts/cs1.1.js" type="text/javascript"></script>-->
		<!--<script src="scripts/append.js" type="text/javascript"></script>-->
		<!--<script src="<%=hphost%>/country/js/hpweb_syn_con.js" type="text/javascript"></script>-->
		<script src="<%=tridionhost%>/us/en/scripts/social_functions.js" type="text/javascript" xml:space="preserve"></script>
		<!--[if IE 6]>	
		<script src="scripts/png.js" type="text/javascript" charset="utf-8">//</script>		
		<script type="text/javascript">
				DD_belatedPNG.fix('.png');
		</script>
		<![endif]-->
	<script type="text/javascript">
var hp = {};
</script>
    <script src="scripts/common/ui-core-min.js" type="text/javascript"></script>
    <script src="scripts/common/animated-container.js" type="text/javascript"></script>
    <script src="scripts/common/selectable.js" type="text/javascript"></script>
   
    <script src="scripts/common/custom-popup.js" type="text/javascript"></script>
    <script src="scripts/common/under-layed-popup.js" type="text/javascript"></script>
    <script src="scripts/molecules/video-poster.js" type="text/javascript"></script>
    <script src="scripts/common/customPopup.js" type="text/javascript"></script>
    <script src="scripts/molecules/radio-checkboxes.js" type="text/javascript"></script>
    <script src="scripts/common/form-reset.js" type="text/javascript"></script>

    <!--<script src="scripts/append-hpe.js" type="text/javascript"></script>-->
<!--[if IE]>
<link href="system/styles/molecules-ie.css" media="screen" rel="stylesheet" type="text/css"/>
<![endif]-->
<!--[if IE 6]>
<script src="scripts/common/common-ie6.js" type="text/javascript">//</script>
<![endif]-->

    <script charset="utf-8" type="text/javascript" xml:space="preserve">
      //var searchTxt = 'Keyword';
      var templateType='no_toolbar';

      var wip=true; //temporary flag to enable or disable js functionality (for different sprints), true to disable functionality
      var agt=navigator.userAgent.toLowerCase();
      var is_ie= (agt.indexOf("msie") != -1);
			var defaultSegment = 'HHO';
			//var segment_ck="SMB";
			var hpAbsDir = '/<%=HTMLEncode(Session("cc"))%>/<%=HTMLEncode(Session("la"))%>/';
			var rtl=false;
	
    </script>
    <!-- END JAVASCRIPT -->

</head>

<body>
   <script language="javascript" type="text/javascript">
if(window.hpmmd==null){hpmmd={type:"Cleansheet Wash" , page:{},product:{},user:{},promo:{},legacy:{}}};
hpmmd.page.name="site:supplies recycle|<%=HTMLEncode(Session("cc"))%>|<%=HTMLEncode(Session("la"))%><%if Session("segment") <> "" then response.Write("|"+Session("segment"))%> : <%= pagename %>";
hpmmd.page ['section']="r2612";
hpmmd.page.sectiontaxonomy="/recycle/ereturns";
hpmmd.page.lifecycle="";
hpmmd.page.events=new Array("");
try { hpmmd.user.ip=(function(){var a='67.50.179.194';if(a.indexOf("<")==0||a.length<7){var b='67.50.179.194';var c='15.192.0.123';a=(b.indexOf("<")==0||b.length<7)?c:b}return a})(); } catch(err) {hpmmd.user.ip='127.0.0.1';}
try { hpmmd.page.server='g5t0352.atlanta.hp.com'; } catch(err) {hpmmd.page.server=window.location.hostname;}
hpmmd.version='20110329A';

			try{(function(){var base=' http://www.hp.com/cma/ng/lib/hpanalytics_common.js'.replace('.js',''),
						cspronames='www.hp.com|welcome.hp.com|www8.hp.com|h\\d+\\.www\\d\\.hp\\.com',csitgnames='@';
			(function(b,c,d,e){function doWrite(a){a=(_ssl&&a.indexOf('https')==-1?a.split('http').join('https'):a);document.write('<sc'+'ript language=\'JavaScript\' type=\'text/javascript\' src=\''+a+'\' xml:space=\'preserve\'></sc'+'ript>')}if(e!=null){doWrite(b+e);return}var f=window.location,a=f.hostname,href=f.href,_ssl=(f.protocol.toLowerCase().indexOf('https')!=-1),rpro=/[\?\&\#]hpanalyticspro=([^\&\?]*)/,respro=rpro.exec(href),rdev=/[\?\&\#]hpanalyticsdev=([^\&\?]*)/,resdev=rdev.exec(href),ritg=/[\?\&\#]hpanalyticsitg=([^\&\?]*)/,resitg=ritg.exec(href),target='.js',t=c.split('|'),i,u=d.split('|'),pro=false,itg=false;for(i=t.length-1;i>=0;i=i-1){if(a.indexOf(t[i])!=-1||a.search(new RegExp(t[i]))!=-1){pro=true;break}}for(i=u.length-1;i>=0;i=i-1){if(a.indexOf(t[i])!=-1||a.search(new RegExp(u[i]))!=-1){itg=true;break}}if(pro){target='.js'}else if(itg){target='_itg.js'}if(resdev){arg=resdev[1].substring(0,4);target='_dev'+(arg.length>0?'_'+arg:'')+'.js'}if(resitg){arg=resitg[1].substring(0,4);target='_itg'+(arg.length>0?'_'+arg:'')+'.js'}if(respro){arg=respro[1].substring(0,4);target='.js'}window._hpenvref=e=target;doWrite(b+e)})(base,cspronames,csitgnames,window._hpenvref);
			})()}catch(err){};
</script>
<!-- BEGIN EVERYTHING -->
   <div class="everything" id="everything">

<!-- BEGIN BODY -->
      <div class="body" id="body">
        <div class="holder">
          <!-- //////////////////////////////////////////////////////////////////////////////////////// BEGIN CONTENT AREA ///////////////////////////////////////////////////////////////////////////-->
         <div id="breadcrumbs" style="display:none;">
            <ul>
              <li class="bc_section_heading"><a href="index-hpe.asp<%=link_cc()%>">Home</a></li>
              <li><a href=""></a></li>
              <!--<li class="bc_current_page">L3 Page</li>-->
            </ul>
          </div>  

       

    <div id="content_section">
    
            <div id="rails_bg_container" class="double_rail png">
	
<div id="main_column" class="white">
                
				<div class=" lft typography_main" style="width: 530px;">
                <div class="fontH3">Pequeñas y medianas empresas (PYMES) y clientes comerciales</div>
                Contratamos con los recicladores cualificados, quienes procesan los productos de manera responsable con el medio ambiente a través de un proceso de reciclado de múltiples fases. Esto ayuda a asegurar que los aparatos electrónicos se reciclen y se prevenga que lleguen a los vertederos.
                <br /><br />
                
Servicios que ofrecemos incluyen:
<ul class="no-left-pad"><li>Desmontaje y reciclaje
<li>Rastreo de activos, auditoría y certificados de destrucción
<li>Transporte y coordinación logística
</ul>

Para participar en este programa, por favor complete el siguiente formulario:
<br /><br />
<form method="post" class="" action="<%=pagename%>">                

<table border="0" cellpadding="0" cellspacing="0" width="500">
							
							<tr>
								<td>
								<label for="company_name">Empresa o razón social</label>
								</td>
								<td width="10"><img src="<%= hphost %>/img/s.gif" width="1" height="1" border="0" alt=""></td>
								<td align="left" valign="top">
								<input class="form-input input-slim" type="text" size="" maxlength="" name="company_name" id="company_name" value="<%=HTMLEncode(Session("company_name")) %>"> </td>
								</td>
							</tr>
							<tr class="decoration">
								<td colspan="3"><img src="<%= hphost %>/img/s.gif" width="1" height="10" border="0" alt=""></td>
							</tr>
							<tr>
								<td>
								<label for="contact_name">Nombre de contacto</label>
								</td>
								<td width="10"><img src="<%= hphost %>/img/s.gif" width="1" height="1" border="0" alt=""></td>
								<td align="left" valign="top">
								<input class="form-input input-slim" type="text" size="" maxlength="" name="contact_name" id="contact_name" value="<%=HTMLEncode(Session("contact_name")) %>"> </td>
								</td>
							</tr>
							<tr class="decoration">
								<td colspan="3"><img src="<%= hphost %>/img/s.gif" width="1" height="10" border="0" alt=""></td>
							</tr>
                            <tr>
								<td>
								<label for="phone">Teléfono</label>
								</td>
								<td width="10"><img src="<%= hphost %>/img/s.gif" width="1" height="1" border="0" alt=""></td>
								<td align="left" valign="top">
								<input class="form-input input-slim" type="text" size="" maxlength="" name="phone" id="phone" value="<%=HTMLEncode(Session("phone")) %>"> </td>
								</td>
							</tr>
							<tr class="decoration">
								<td colspan="3"><img src="<%= hphost %>/img/s.gif" width="1" height="10" border="0" alt=""></td>
							</tr>
                            <tr>
								<td>
								<label for="email">Correo electrónico </label>
								</td>
								<td width="10"><img src="<%= hphost %>/img/s.gif" width="1" height="1" border="0" alt=""></td>
								<td align="left" valign="top">
								<input class="form-input input-slim" type="text" size="" maxlength="" name="email" id="email" value="<%=HTMLEncode(Session("email")) %>"> </td>
								</td>
							</tr>
							<tr class="decoration">
								<td colspan="3"><img src="<%= hphost %>/img/s.gif" width="1" height="10" border="0" alt=""></td>
							</tr>
                            <tr>
								<td>
								<label for="address1">Dirección(es) de la ubicación del equipo(s)	</label>
								</td>
								<td width="10"><img src="<%= hphost %>/img/s.gif" width="1" height="1" border="0" alt=""></td>
								<td align="left" valign="top">
								<input class="form-input input-slim" type="text" size="" maxlength="" name="address1" id="address1" value="<%=HTMLEncode(Session("address1")) %>"> </td>
								</td>
							</tr>
							<tr class="decoration">
								<td colspan="3"><img src="<%= hphost %>/img/s.gif" width="1" height="10" border="0" alt=""></td>
							</tr>
                            <tr>
								<td>
								<label for="address2"></label>
								</td>
								<td width="10"><img src="<%= hphost %>/img/s.gif" width="1" height="1" border="0" alt=""></td>
								<td align="left" valign="top">
								<input class="form-input input-slim" type="text" size="" maxlength="" name="address2" id="address2" value="<%=HTMLEncode(Session("address2")) %>"> </td>
								</td>
							</tr>
							<tr class="decoration">
								<td colspan="3"><img src="<%= hphost %>/img/s.gif" width="1" height="10" border="0" alt=""></td>
							</tr>
                            <tr>
								<td>
								<label for="address3"></label>
								</td>
								<td width="10"><img src="<%= hphost %>/img/s.gif" width="1" height="1" border="0" alt=""></td>
								<td align="left" valign="top">
								<input class="form-input input-slim" type="text" size="" maxlength="" name="address3" id="address3" value="<%=HTMLEncode(Session("address3")) %>"> </td>
								</td>
							</tr>
							<tr class="decoration">
								<td colspan="3"><img src="<%= hphost %>/img/s.gif" width="1" height="10" border="0" alt=""></td>
							</tr>
                            <tr>
								<td valign="top">
								<label for="desc">Inventario de equipos a reciclar</label>
								</td>
								<td width="10"><img src="<%= hphost %>/img/s.gif" width="1" height="1" border="0" alt=""></td>
								<td align="left" valign="top">
								<textarea name="desc" id="desc" cols="35" rows="3" style="font-family: HPSimplified;font-size:16px"><%=HTMLEncode(session("desc")) %></textarea> </td>
								</td>
							</tr>
							<tr class="decoration">
								<td colspan="3"><img src="<%= hphost %>/img/s.gif" width="1" height="10" border="0" alt=""></td>
							</tr>
						</table>

						<table cellpadding="0" cellspacing="0" border="0" width="500">
                        	
									<tr><td colspan="7">¿Requiere transporte?</td></tr>
                                    <tr>
											<td width="30"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
											<td><span class="rdbut"><a onclick="" href="javascript:void(0)" tabindex="250" class=" "><input class="" type="radio" name="transport" value="Y" id="transport_yes" <% if Session("transport") = "Y" then %>checked="true"<% end if %>></a></span></td><td align="center"><label for="transport_yes">Si</label></td>
											<td width="10"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
											<td><span class="rdbut"><a onclick="" href="javascript:void(0)" tabindex="250" class=" "><input class="" type="radio" name="transport" value="N" id="transport_no" <% if Session("transport") = "N" then %>checked="true"<% end if %>></a></span></td><td align="center"><label for="transport_no">No</label></td>
                                            <td width="70%"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
										</tr>
										<tr>
											
											<td width="10"><img src="<%= hphost %>/img/s.gif" width="10" height="20" border="0" alt=""></td>
											
										</tr>
                                   <tr><td colspan="7">¿Requiere embalaje?</td></tr>
                                    <tr>
											<td width="30"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
											<td><span class="rdbut"><a onclick="" href="javascript:void(0)" tabindex="250" class=" "><input class="" type="radio" name="packing" value="Y" id="packing_yes" <% if Session("packing") = "Y" then %>checked="true"<% end if %>></a></span></td><td align="center"><label for="packing_yes">Si</label></td>
											<td width="10"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
											<td><span class="rdbut"><a onclick="" href="javascript:void(0)" tabindex="250" class=" "><input class="" type="radio" name="packing" value="N" id="packing_no" <% if Session("packing") = "N" then %>checked="true"<% end if %>></a></span></td><td align="center"><label for="packing_no">No</label></td>
                                            <td width="70%"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
										</tr>
										<tr>
											
											<td width="10"><img src="<%= hphost %>/img/s.gif" width="10" height="20" border="0" alt=""></td>
											
										</tr>
                                   <tr><td colspan="7">¿Requiere  un certificado de destrucción?</td></tr>
                                    <tr>
											<td width="30"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
											<td><span class="rdbut"><a onclick="" href="javascript:void(0)" tabindex="250" class=" "><input class="" type="radio" name="certificate" value="Y" id="certificate_yes" <% if Session("certificate") = "Y" then %>checked="true"<% end if %>></a></span></td><td align="center"><label for="certificate_yes">Si</label></td>
											<td width="10"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
											<td><span class="rdbut"><a onclick="" href="javascript:void(0)" tabindex="250" class=" "><input class="" type="radio" name="certificate" value="N" id="certificate_no" <% if Session("certificate") = "N" then %>checked="true"<% end if %>></a></span></td><td align="center"><label for="certificate_no">No</label></td>
                                            <td width="70%"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
										</tr>
										<tr>
											
											<td width="10"><img src="<%= hphost %>/img/s.gif" width="10" height="20" border="0" alt=""></td>
											
										</tr>
                                     <tr><td colspan="7">¿Requiere una lista de números de serie de artículos reciclados? </td></tr>
                                    <tr>
											<td width="30"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
											<td><span class="rdbut"><a onclick="" href="javascript:void(0)" tabindex="250" class=" "><input class="" type="radio" name="serial" value="Y" id="serial_yes" <% if Session("serial") = "Y" then %>checked="true"<% end if %>></a></span></td><td align="center"><label for="serial_yes">Si</label></td>
											<td width="10"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
											<td><span class="rdbut"><a onclick="" href="javascript:void(0)" tabindex="250" class=" "><input class="" type="radio" name="serial" value="N" id="serial_no" <% if Session("serial") = "N" then %>checked="true"<% end if %>></a></span></td><td align="center"><label for="serial_no">No</label></td>
                                            <td width="70%"><img src="<%= hphost %>/img/s.gif" width="10" height="1" border="0" alt=""></td>
										</tr>
										<tr>
											
											<td width="10"><img src="<%= hphost %>/img/s.gif" width="10" height="20" border="0" alt=""></td>
											
										</tr>
										
                        
                        </table>
<div class="divider_bottom divider_grey m20"></div>

<a class="button  inline critical" href="javascript:void(0)" tabindex="250" onclick="" rel=""><input type="submit" class="" id="" value="Enviar" /></a>

</form>
                
                </div>
                
                
                
               
				<div class="content_block clf">
					&nbsp;
           		</div>
          	
			
            
		</div>
              
            </div>
          </div>
          

          <!-- //////////////////////////////////////////////////////////////////////////////////////// END CONTENT AREA ///////////////////////////////////////////////////////////////////////////-->
          <div class="body_right"> </div>
        </div>
      </div></div>
      <!-- END BODY -->

<script type="text/javascript">
document.addEvent('domready', function() {
//dynamically generated from used molecules
if (window.addEventListener) {
$$('span.rdbut a').addClass('rbtn enable');
$$('span.rdbut a input').addClass('hidden');
initRadioButtons();
}
});

</script>


    
</body>
</html>