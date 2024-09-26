namespace Problemset_Collection_Server
{
    public static class Helpers
    {
        public static string ToTitle(this string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return input;

            return string.Join(" ", input.Split(' ')
                                        .Where(w => w.Length > 0)
                                        .Select(w => char.ToUpper(w[0]) + w.Substring(1).ToLower()));
        }
    }
}
