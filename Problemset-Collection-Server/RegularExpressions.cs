using System.Text.RegularExpressions;

namespace Problemset_Collection_Server
{
    public class RegularExpressions
    {
        private const string urlPattern = @"^(https?):\/\/(?:[a-zA-Z0-9]" +
                    @"(?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}" +
                    @"(?::(?:0|[1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}" +
                    @"|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?" +
                    @"(?:\/(?:[-a-zA-Z0-9@%_\+.~#?&=]+\/?)*)?$";
        public static Regex urlRegex = new Regex(urlPattern, RegexOptions.IgnoreCase);

        private const string emailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
        public static Regex emailRegex = new Regex(emailPattern);
    }
}
