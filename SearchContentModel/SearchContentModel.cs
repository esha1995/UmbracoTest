using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common.PublishedModels;
using Searching.Site.Model.ViewModels;

namespace Searching.Site.Model
{
    public class SearchContentModel : ContentModel
    {
        public SearchContentModel(IPublishedContent content) : base(content)
        {

        }
        public SearchViewModel SearchViewModel { get; set; }

    }
}
