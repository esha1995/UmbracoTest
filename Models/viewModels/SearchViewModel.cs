using System.ComponentModel.DataAnnotations;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common.PublishedModels;


namespace Searching.Site.Model.ViewModels
{
    public class SearchViewModel
    {
        [Display(Name ="Search Term")]
        [Required(ErrorMessage ="You must enter a search term")]
        public string Query { get; set; }
        [Display(Name ="Category")]
        public string Category { get; set; }

        public string Page { get; set; }
    }
}
