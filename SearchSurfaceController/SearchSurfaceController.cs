using Umbraco.Cms.Web.Common.Controllers;
using Umbraco.Cms.Core.Web;
using Microsoft.AspNetCore.Mvc;
using Searching.Site.Model.ViewModels;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Routing;
using System.Diagnostics;

namespace Searching.Site.Controllers.Surface
{
    public class SearchSurfaceController : Umbraco.Cms.Web.Website.Controllers.SurfaceController
    {
        public SearchSurfaceController(IUmbracoContextAccessor umbracoContextAccessor, IUmbracoDatabaseFactory databaseFactory, ServiceContext services, AppCaches appCaches, IProfilingLogger profilingLogger, IPublishedUrlProvider publishedUrlProvider) : base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
        {
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionName("SubmitForm")]
        public IActionResult SubmitForm(SearchViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return CurrentUmbracoPage();
            }
            var queryString = new Microsoft.AspNetCore.Http.QueryString();
            queryString.Add("query", "hej");
            if (!string.IsNullOrWhiteSpace(model.Query))
            {
                queryString.Add("query", model.Query);
            }

            if (!string.IsNullOrWhiteSpace(model.Category))
            {
                queryString.Add("category", model.Category);
            }
            return RedirectToCurrentUmbracoPage(queryString);
        }
        
        public IActionResult RenderForm(SearchViewModel model)
        {
            return PartialView("Partials/SearchForm", model);
        }
    }

}