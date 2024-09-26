using System.Text.RegularExpressions;

namespace Problemset_Collection_Server
{
    public class RegularExpressions
    {
        private const string urlPattern = @"^(https?:\/\/)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(:[0-9]{1,5})?(\/[^\s]*)?$";
        public static Regex urlRegex = new Regex(urlPattern);

    }
}
