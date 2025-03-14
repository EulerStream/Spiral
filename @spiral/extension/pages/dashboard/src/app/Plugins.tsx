import {withErrorBoundary, withSuspense} from '@extension/shared';
import PluginUpload from "@src/components/plugin-upload";
import SectionHeader from "@src/components/ui/section-header";


const Plugins = () => {

  return (
      <main>
        {/* Plugin Installer */}
        <section>
          <SectionHeader header={"Install Plugins"} description={"Drag & drop plugin files to install them."}/>
          <PluginUpload className={"mt-4 max-w-[600px]"}  />
        </section>

        {/* Plugin Manager */}
        <section className={"mt-6"}>
          <h3 className={"text-xl font-bold"}>Manage Plugins</h3>
          <h4 className={"text-sm text-muted-fg"}>Enable, disable, install, and uninstall plugins.</h4>
        </section>
      </main>
  );
};


export default withErrorBoundary(withSuspense(Plugins, <div> Loading ... </div>), <div> Error Occur </div>);
