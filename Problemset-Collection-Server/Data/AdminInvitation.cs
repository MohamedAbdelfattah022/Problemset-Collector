﻿using System.ComponentModel.DataAnnotations;

namespace Problemset_Collection_Server.Data
{
    public class AdminInvitation
    {

        [Key]
        public string Email { get; set; }
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
    }
}
