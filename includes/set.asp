<!--#INCLUDE FILE = "filter.asp" -->
<%
if Session("cc") = "" then
	Session("cc") = "co"
end if

if Session("la") = "" then
	Session("la") = "es"
end if 

if not ValidateTags(request.querystring("printable")) and trim(request.querystring("printable")) = "true" then
	printable = true
else 
	printable = false
end if 

if Request.ServerVariables("SERVER_PORT_SECURE") = 0 then
	secure = false
elseif Request.ServerVariables("SERVER_PORT_SECURE") = 1 then
	secure = true
end if

if secure = true then
	hphost = "https://secure.hp-ww.com"
	tridionhost = "https://ssl.www8.hp.com"
else
	hphost = "http://welcome.hp-ww.com"
	tridionhost = "http://www.www8-hp.com"
end if 
	
function link_cc()
	if Session("cc") <> "" then
		link_cc = "?__cc=" & Session("cc")
	else
		link_cc = ""
	end if
	if Session("la") <> "" then
		if link_cc <> "" then
			link_cc = link_cc & "&__la=" & Session("la")
		else 
			link_cc = link_cc & "?__la=" & Session("la")
		end if
	end if
	if Session("re") <> "" and Session("re") = "1" then
		if link_cc <> "" then
			link_cc = link_cc & "&__re=" & Session("re")
		else 
			link_cc = link_cc & "?__re=" & Session("re")
		end if
	end if
end function


%>
