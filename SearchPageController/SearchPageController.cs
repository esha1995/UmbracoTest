using Umbraco.Cms.Web.Common.Controllers;
using Umbraco.Cms.Core.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Models;
using Searching.Site.Model;
using Searching.Site.Model.ViewModels;

namespace Searching.Site.Controllers
{
    
    public class SearchController : Umbraco.Cms.Web.Common.Controllers.RenderController
    {
        public SearchController(ILogger<RenderController> logger, ICompositeViewEngine compositeViewEngine, IUmbracoContextAccessor umbracoContextAccessor) : base(logger, compositeViewEngine, umbracoContextAccessor)
        {
        }
        
        [HttpGet]
        
        public IActionResult Index([FromQuery(Name = "page")] string page,[FromQuery(Name = "query")] string query, [FromQuery(Name = "category")] string category)
        {
            var searchPageModel = new SearchContentModel(CurrentPage);

            var searchViewModel = new SearchViewModel()
            {
                Query = query,
                Category = category,
                Page = page
            };
            searchPageModel.SearchViewModel = searchViewModel;

            return CurrentTemplate(searchPageModel);
        }
    }
    
}