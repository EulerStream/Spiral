import SectionHeader from "@src/components/ui/section-header";
import {InputWithText} from "@src/components/ui/input";
import {CheckboxWithText} from "@src/components/ui/checkbox";
import {FormEvent, useState} from "react";
import {Button} from "@src/components/ui/button";
import {getPath} from "@src/lib/utils";

export function getKioskPath(username: string, showComments: boolean) {
  const creatorUsernameFixed = username.startsWith('@') ? username : `@${username}`;
  return getPath(`/tools/live-kiosk/${creatorUsernameFixed}?comments=${showComments ? '1' : '0'}`);
}

export default function LiveKioskForm() {
  const [showComments, setShowComments] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState('' as string);

  const onShowCommentsClicked = () => {
    setShowComments(!showComments);
  }

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const creatorUsernameFixed = creatorUsername.startsWith('@') ? creatorUsername : `@${creatorUsername}`;
    window.open(getKioskPath(creatorUsernameFixed, showComments));
  }

  const onCreatorUsernameChange = (e: FormEvent<HTMLInputElement>) => {
    setCreatorUsername(e.currentTarget.value);
  }

  return (
      <div>
        <SectionHeader header={'Live Kiosk'} description={'Launch a TikTok LIVE stream in Kiosk mode'}  />

        <form
            onSubmit={onFormSubmit}
            className={'max-w-[400px] mt-5 flex gap-y-6 flex-col bg-accent-darker p-4 rounded-xl'}
        >
            <InputWithText
                onChange={onCreatorUsernameChange}
                required={true}
                text={'Creator Username'}
                placeholder={'@username'}
                subtext={'The username of the creator to launch the kiosk for.'}
            />
            <CheckboxWithText
                checked={showComments}
                onClick={onShowCommentsClicked}
                text={'Show Comments'}
                subtext={'Whether to include the comment list'}
                required={false}
            />

          <Button type={'submit'}>Launch Kiosk</Button>

        </form>

      </div>
  )

}