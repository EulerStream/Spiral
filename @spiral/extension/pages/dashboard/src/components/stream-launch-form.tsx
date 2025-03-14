import {getPath} from "@src/lib/utils";
import {FormEvent, useState} from "react";
import SectionHeader from "@src/components/ui/section-header";
import {InputWithText} from "@src/components/ui/input";
import {CheckboxWithText} from "@src/components/ui/checkbox";
import {Button} from "@src/components/ui/button";

export function getStreamPath(username: string, showComments: boolean) {
  const creatorUsernameFixed = username.startsWith('@') ? username : `@${username}`;
  return getPath(`/stream/${creatorUsernameFixed}?comments=${showComments ? '1' : '0'}`);
}

export default function StreamLaunchForm() {
  const [showComments, setShowComments] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState('' as string);

  const onShowCommentsClicked = () => {
    setShowComments(!showComments);
  }

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const creatorUsernameFixed = creatorUsername.startsWith('@') ? creatorUsername : `@${creatorUsername}`;
    window.open(getStreamPath(creatorUsernameFixed, showComments));
  }

  const onCreatorUsernameChange = (e: FormEvent<HTMLInputElement>) => {
    setCreatorUsername(e.currentTarget.value);
  }

  return (
      <div>
        <SectionHeader header={'Launch Stream'} description={'Connect to a TikTok LIVE stream'}/>

        <form
            onSubmit={onFormSubmit}
            className={'max-w-[600px] mt-5 flex gap-y-6 flex-col bg-accent-darker p-4 rounded-xl'}
        >
          <InputWithText
              onChange={onCreatorUsernameChange}
              required={true}
              text={'Creator Username'}
              placeholder={'@username'}
              subtext={'The username of the creator to connect to.'}
          />
          <CheckboxWithText
              checked={showComments}
              onClick={onShowCommentsClicked}
              text={'Show Comments'}
              subtext={'Whether to include the comment list in the stream view'}
              required={false}
          />

          <Button type={'submit'}>Connect to Stream</Button>

        </form>

      </div>
  )

}