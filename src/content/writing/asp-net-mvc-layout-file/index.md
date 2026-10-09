---
title: "ASP.NET :: MVC :: Layout file"
date: 2014-10-31
section: lab
tags: [".NET"]
summary: "Master pages in MVC are a little different from that of ASP.NET. PlaceHolder is the one that holds a page's content inside the master page. In the same way, RequestBody is the…"
---

Master pages in MVC are a little different from that of ASP.NET.   
  
PlaceHolder is the one that holds a page's content inside the master page. In the same way, RequestBody() is the place where the view's data/content is placed and then rendered to the user.  
  
RequestBody() is in the \_Layout.cshtml page.  
  
But how is it that MVC knows that it has to start \_Layout.cshtml first before anything else is loaded??  
That is in a file called \_ViewStart.cshtml  
  
This is the code inside it:  
  
@{  
    Layout = "~/Views/Shared/\_Layout.cshtml";

}  
  
If we want to override a specific page that we can have a page with the same name in the folder of your views.  
  
Say you have a folder Home and it has Index.cshtml and it should use a Layout called Layout2.cshtml file then create \_Layout2.cshtml in the same folder.  
  
You can even do this within the view as well like this:  
  
@{  
    ViewBag.Title = "Home Page";  
    Layout = "~/Views/Shared/\_Layout2.cshtml";

}
