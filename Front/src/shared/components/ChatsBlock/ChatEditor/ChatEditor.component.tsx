/* tslint:disable */
import React, {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle
} from "react";
import TextInputItem from "../../EditorComponents/EditorTextInput/EditorTextInput.component";
import ChipsDropdown from "../../ChipsDropdown";
import EditorSwitch from "../../EditorComponents/EditorSwitch";
import {
  Avatar,
  PhotoBlock,
  Photo,
  StyledEditor,
  EditorForm
} from "./ChatEditor.styled";
import { IFullDataUser } from "../../../../App.types";
import Jimp from "jimp";
import {
  ButtonBlock,
  FieldName,
  Element
} from "../../EditorComponents/EditorComponents.styled";
import defaultAvatar from "../../../../assets/img/DefaultPhoto.jpg";

interface IEditorBlockProps {
  currentUser: IFullDataUser;
  existChatData?: api.models.IPreviewChat;
  peoples: api.models.IMember[];
  onMembersInputChange: (username: string) => void;
  saveUserChanges: (chat: api.models.IPreviewChat) => void;
  isDisabledToApply: (disabled: boolean) => void;
}

const EditorBlock = forwardRef(
  (
    {
      currentUser,
      existChatData,
      peoples,
      onMembersInputChange,
      saveUserChanges,
      isDisabledToApply
    }: IEditorBlockProps,
    ref
  ) => {
    var nullRoom: api.models.IPreviewChat = {
      chatID: "0",
      avatar: defaultAvatar,
      type: "private",
      name: "",
      members: [],
      lastMessage: {
        id: 0,
        id_author: 0,
        isHiddenFromAuthor: true,
        time: "2020-04-12 17:20:00",
        type: "text",
        message: "quasi"
      }
    };
    const initChat: api.models.IPreviewChat = existChatData
      ? existChatData
      : nullRoom;
    const [chat, setChat] = useState(initChat);

    useEffect(() => {
      console.log(chat);
      if (chat.type === "private" && chat.members.length >= 2) {
        setChat(prevState => {
          let newState: api.models.IPreviewChat = {
            avatar: prevState.avatar,
            name: prevState.name,
            chatID: prevState.chatID,
            lastMessage: prevState.lastMessage,
            type: prevState.type,
            members: prevState.members.slice(0, prevState.members.length - 1)
          };
          return newState;
        });
      }
      isDisabledToApply(
        (chat.type === "public" && chat.name.length < 4) ||
          chat.type === "" ||
          (chat.type === "private" && chat.members.length > 1) ||
          chat.members.length === 0
          ? true
          : false
      );
    }, [chat]);

    useImperativeHandle(ref, () => ({
      callSave() {
        saveUserChanges(chat);
      }
    }));

    const inputOpenFileRef = useRef<HTMLInputElement>(null);

    const showOpenFileDlg = () => {
      if (inputOpenFileRef.current !== null) {
        inputOpenFileRef.current.click();
      }
    };

    const getUrlFromFile = (e: React.FormEvent<HTMLInputElement>) => {
      var files: FileList = e.currentTarget.files!;
      Array.from(files).map((file: File, indx: number) => {
        var name = file.name;
        if (file.type.includes("image/")) {
          let reader = new FileReader();
          reader.onload = async () => {
            if (reader.result && typeof reader.result === "string") {
              console.log(name);
              Jimp.read(reader.result).then(async image => {
                console.log("До сжатия : ", image.bitmap.data.length);
                if (image.bitmap.data.length > 3 * 1000 * 1000) {
                  console.log(
                    "Size before: " + image.getWidth() + "x" + image.getHeight()
                  );
                  image
                    .quality(100)
                    .resize(/*.getWidth()*0.65*/ 1000, Jimp.AUTO);
                  console.log(
                    "Size after: " + image.getWidth() + "x" + image.getHeight()
                  );
                  console.log("После сжатия : ", image.bitmap.data.length);
                  const res = await image.getBase64Async(image.getMIME());
                  await setChat({ ...chat, avatar: res });
                } else {
                  const res = await image.getBase64Async(image.getMIME());
                  await setChat({ ...chat, avatar: res });
                }
              });
            }
          };
          reader.readAsDataURL(file);
        } else {
          alert("Invalid type of file " + file.name);
        }
      });
    };

    return (
      <StyledEditor>
        <PhotoBlock>
          <Photo src={chat.avatar} alt={"Photo is here"} />
          <ButtonBlock>
            <div className="label-button" onClick={showOpenFileDlg}>
              Load
            </div>
            <input
              type="file"
              ref={inputOpenFileRef}
              accept=".jpg, .jpeg, .png"
              onChange={getUrlFromFile}
              style={{ display: "none" }}
            />
          </ButtonBlock>
        </PhotoBlock>
        <EditorForm>
          <EditorSwitch
            required={true}
            label="Type"
            values={["private", "public"]}
            onSelect={e => setChat({ ...chat, type: e })}
          />
          {chat.type === "public" ? (
            <TextInputItem
              required={true}
              label="Chat name"
              placeholder="Chat Name in system (public only)"
              lenght="TextInput"
              value={chat.name}
              onChange={e => setChat({ ...chat, name: e })}
              restriction={{ type: "min length", length: 4 }}
            />
          ) : null}
          <ChipsDropdown
            label="Add members"
            restriction={
              chat.type === "private" ? { type: "only one element" } : undefined
            }
            inputData={peoples
              .filter(member => member.idUsers !== currentUser.idUsers)
              .map(member => {
                return (
                  <div key={member.username} style={{ display: "inline-flex" }}>
                    <Avatar>
                      <img
                        key={member.idUsers}
                        src={
                          member.avatar !== null ? member.avatar : defaultAvatar
                        }
                      />
                    </Avatar>
                    {member.username}
                  </div>
                );
              })}
            alreadySelected={
              existChatData
                ? existChatData.members.map(member => member.username)
                : undefined
            }
            onInputChange={onMembersInputChange}
            onChoise={e => {
              setChat({
                ...chat,
                members: peoples.filter(people => e.includes(people.username))
              });
            }}
          />
        </EditorForm>
      </StyledEditor>
    );
  }
);

export default EditorBlock;
