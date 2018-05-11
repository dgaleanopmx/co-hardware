<%

'THIS CODE IS REQUIRED TO FORCE A REFRESH
'USING THE BACK BUTTON AND TRYING TO RE-SAVE CAN 
'CAUSE PROBLEMS WITHOUT THIS
	Response.Expires = 60
	Response.Expiresabsolute = Now() - 1
	Response.AddHeader "pragma", "no-cache"
	Response.AddHeader "cache-control", "private"
	Response.CacheControl = "no-cache"

Function ValidateTags(QueryString)
	Dim o
	Set o = CreateObject("VBScript.RegExp") ' -> VB Script 5.0

	Dim sBad

	sBad = "(<\s*(script|object|applet|embed|form)\s*>)"   ' <  script xxx >
	sbad = sbad & "|" & "(<.*>)"              ' >xxxxx<  warning includes hyperlinks and stuff between > and <
	sbad = sbad & "|" & "(&.{1,5};)"   ' &xxxx;
	sbad = sbad & "|" & "eval\s*\("    ' eval  (
 	sbad = sbad & "|" & "(event\s*=)"  ' event  =

	' and bad characters too: " ' %  ( ) +
	sbad = sbad & "|" & """" & "|" & "'" & "|" & "%" & "|" & "\(" & "|" & "\)" & "|" & "\+" 

	'Now lets check for encoding
	sbad = Replace(sbad,"<", "(<|%3C)")
	sbad = Replace(sbad,">", "(>|%3E)")

	o.IgnoreCase = True 'ignore case of string
	o.Global =False 'stop on first hit

	o.Pattern = sBad

	'ValidateTags = o.Test(QueryString)
	if o.Test(QueryString) = false then
		ValidateTags = false
	else
		redirStr = "error.asp" & link_cc() 
		if link_cc() <> "" then
			redirStr = redirStr & "&"
		else
			redirStr = redirStr & "?"
		end if
		if Session("cc") = "ca" and Session("la") = "fr" then 
			redirStr = redirStr & "err=Caractère%20non%20valide%20dans%20l`entrée%20de%20données"
		else
			redirStr = redirStr & "err=Invalid%20character%20in%20input" '& QueryString
		end if
		Session("errstr") = "Invalid character in input"
		response.redirect redirStr
		
	end if
	
	Set o = Nothing
End Function

Function NotNumeric(QueryString)
	Dim o
	Set o = CreateObject("VBScript.RegExp") ' -> VB Script 5.0

	Dim sBad

	sBad = "(0123456789\.,)"   ' digits
	
	o.IgnoreCase = True 'ignore case of string
	o.Global =False 'stop on first hit

	o.Pattern = sBad

	NotNumeric = o.Test(QueryString)

	Set o = Nothing
End Function

public function entify(byVal strIn)
		if len(strIn) > 0 then
			entify = replace(replace(replace(replace(replace(replace(strIn,"&","&amp;"),"<","&lt;"),">","&gt;"),"""","&quot;"),"'","&#x27;"),"/","&#x2F;")
		else	
			entify = strIn
		end if 
end function

Function cleanseData(dataInput,dataType,dataLength)
   Dim regex, validInput, expressionmatch
   regex = ""
   validInput = "1"
   If dataType = "string" And Len(dataInput) > 0 Then
       regex = "^[\w-\.]{1,"& dataLength &"}$"
   ElseIf dataType = "email" And Len(dataInput) > 0 Then
       regex = "^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$"
   ElseIf dataType = "integer" And Len(dataInput) > 0 Then
       regex = "^\d{1,"& dataLength &"}$"
   ElseIf dataType = "date" And Len(dataInput) > 0 Then
       If Not IsDate(dataInput) Then validInput = "0" End If
   ElseIf dataType = "text" And Len(dataInput) > 0 Then
       If Len(dataInput) > dataLength Then validInput = "0" End If
   End If
   If Len(regex) > 0 And Len(dataInput) > 0 Then
       Set RegExpObj = New RegExp
       RegExpObj.Pattern = regex
       RegExpObj.IgnoreCase = True
       RegExpObj.Global = True
       RegExpChk = RegExpObj.Test(dataInput)
       If Not RegExpChk Then
           validInput = "0"
       End If
       Set RegExpObj = nothing
   End If
   If validInput = "1" And Len(dataInput) > 0 Then
       cleanseData = specialCharacterEncoding(dataInput)
   ElseIf Len(dataInput) = 0 Then
       cleanseData = ""
   Else
       redirStr = "error.asp" & link_cc() 
		if link_cc() <> "" then
			redirStr = redirStr & "&"
		else
			redirStr = redirStr & "?"
		end if
		if Session("cc") = "ca" and Session("la") = "fr" then 
			redirStr = redirStr & "err=Caractère%20non%20valide%20dans%20l`entrée%20de%20données"
		else
			redirStr = redirStr & "err=Invalid%20character%20in%20input" '& QueryString
		end if
		Session("errstr") = "Invalid character in input"
		response.redirect redirStr
   End If
End Function

Function specialCharacterEncoding(encodeData)
    encodeData = replace(encodeData,"&", "&#38;")
    encodeData = replace(encodeData,"'", "&#39;")
    encodeData = replace(encodeData,"""", "&quot;")
    encodeData = replace(encodeData,">", "&gt;")
    encodeData = replace(encodeData,"<", "&lt;")
    encodeData = replace(encodeData,")", "&#41;")
    encodeData = replace(encodeData,"(", "&#40;")
    encodeData = replace(encodeData,"]", "&#93;")
    encodeData = replace(encodeData,"[", "&#91;")
    encodeData = replace(encodeData,"}", "&#125;")
    encodeData = replace(encodeData,"{", "&#123;")
    encodeData = replace(encodeData,"--", "&#45;&#45;")
    encodeData = replace(encodeData,"=", "&#61;")
    specialCharacterEncoding = encodeData    
End Function

Function HTMLEncode(instring)
  If Not IsNull(instring) then
    HTMLEncode=Server.HTMLEncode(instring)
  else 
    HTMLEncode=""
  end if
End function
%>