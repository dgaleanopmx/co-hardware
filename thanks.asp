<%@LANGUAGE="VBSCRIPT" CODEPAGE=65001%><% Response.CharSet = "utf-8" %><% 
Response.AddHeader "Content-Type", "text/html;charset=UTF-8"
	pagename = "thanks.asp"
	%><!--#INCLUDE FILE = "includes/set.asp" --><%
	pagetitle = "Reciclaje de computadores"
	
	pagetagline = ""
	
		
	
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
                <div class="fontH3 ">Su solicitud ha sido enviada correctamente</div>
               Gracias por participar en el programa de reciclaje de hardware de HP. HP aprecia y comparte su compromiso con el medio ambiente.<br /><br />
 
Su solicitud de cotización se ha escrito correctamente. Dentro de 2-3 días laborales usted será contactado por teléfono o correo electrónico para discutir su petición en detalle, o para responder a sus preguntas.<br /><br />
 
Si no se comunica dentro de este tiempo, por favor póngase en contacto con HP por correo electrónico <a href="mailto:reciclar@hp.com">reciclar@hp.com</a>.<br /><br />
                
                



<div class="divider_bottom divider_grey m20"></div>

<a class="button primary inline " href="javascript:window.parent.document.getElementById('v6_close').click();" tabindex="250" onclick="" rel=""><input type="submit" class="" id="" value="Cerrar" /></a>


                
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
 
 window.parent.document.getElementById("theform").style.height = "350px";
 
});

</script>


    
</body>
</html>