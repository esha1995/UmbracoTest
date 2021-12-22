using Microsoft.AspNetCore.Http;
using Umbraco.Cms.Core.Services;

namespace UmbracoTest.Helpers
{
    public static class QueryStringHelper
    { 

        public static int getIntFromQueryString(HttpContext request, string key, int fallbackvalue = 0)
        {
            string stringValue = request.Request.Query[key];
            if(stringValue != null && !string.IsNullOrWhiteSpace(stringValue) && int.TryParse(stringValue, out var numericValue))
            {
                return numericValue;
            }
            return fallbackvalue;
        }

        public static string getQueryString(this HttpContext request, string key, string fallBack)
        {
            string stringValue = request.Request.Query[key];
            if(stringValue != null && !string.IsNullOrWhiteSpace(stringValue))
            {
                return stringValue;
            }
            return fallBack;
        }
    }
}

