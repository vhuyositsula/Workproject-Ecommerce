using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorkProject.Helpers
{
    public class AppSettings
    {
        //Properties for JWT Token Signtures
        public string ExpireTime { get; set; }
        public string Secret { get; set; }
    }
}
