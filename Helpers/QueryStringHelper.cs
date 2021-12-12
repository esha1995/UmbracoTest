using System;
using Microsoft.AspNetCore.Http;


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
    }
}
