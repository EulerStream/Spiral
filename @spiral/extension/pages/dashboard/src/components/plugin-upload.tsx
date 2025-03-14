import {FileUploader} from "@src/components/ui/uploader";
import {HTMLProps, useState} from "react";
import {Button} from "@src/components/ui/button";
import {installPlugin} from "@extension/plugin-manager";
import {toast} from 'sonner';

export default function PluginUpload(props: HTMLProps<HTMLDivElement>) {
  const [value, setValue] = useState<File[]>();
  const hasValue = value && value.length > 0;

  const onUpload = async (files: File[]) => {
    setValue(files);
  }

  const onInstall = async (files: File[]) => {

    for (let file of files) {
      try {
        await installPlugin(file);
      } catch (ex) {
        toast.error(String(ex));
      }
    }

  }

  return (
      <div {...props}>
        <FileUploader onUpload={onUpload} value={value} maxSize={1024 * 1024} maxFileCount={1}
                      accept={{"application/x-spiral": [".spiral"]}} acceptDesc={"*.spiral"}/>
        <Button onClick={async () => onInstall(value!)} variant={"secondary"} disabled={!hasValue} className={"mt-4"}>Install
          Plugin{value?.length != 1 ? 's' : ''}</Button>
      </div>
  )
}