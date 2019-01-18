using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ForecastSite.Startup))]
namespace ForecastSite
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
