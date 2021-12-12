/* tslint:disable */
import React, {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle
} from "react";
import DateItem from "../../EditorComponents/EditorDate/EditorDate.component";
import TextInputItem from "../../EditorComponents/EditorTextInput/EditorTextInput.component";
import AutoComplete from "../../EditorComponents/EditorAutoComplete";
import {
  FieldName,
  PhotoBlock,
  Photo,
  StyledEditor,
  EditorForm
} from "./EditorBlock.styled";
import { IFullDataUser } from "../../../../App.types";
import { initialState } from "../../../../App.reducer";
import Jimp from "jimp";
import { ButtonBlock } from "../../EditorComponents/EditorComponents.styled";

interface IEditorBlockProps {
  contries: { id: number; name_en: string }[];
  cities: { id: number; country_id: number; name_en: string }[];
  existUserData?: IFullDataUser;
  saveUserChanges: (user: IFullDataUser) => void;
  isDisabledToApply: (disabled: boolean) => void;
}

const EditorBlock = forwardRef(
  (
    {
      contries,
      cities,
      existUserData,
      saveUserChanges,
      isDisabledToApply
    }: IEditorBlockProps,
    ref
  ) => {
    const initUser: IFullDataUser = existUserData
      ? existUserData
      : initialState.user;
    const isDisabled = existUserData ? true : false;
    const [user, setUser] = useState(initUser);
    const [visible, setVisible] = useState(false);
    const [selectedContry, setSelectedContryBuf] = useState("");
    const [selectedCity, setSelectedCityBuf] = useState("");
    const [citiesBuf, setCitiesBuf] = useState([""]);
    const [repPass, setRepPass] = useState("");

    useEffect(() => {
      isDisabledToApply(
        user.username.length < 4 ||
          user.FirstName.length < 3 ||
          user.LastName.length < 3 ||
          user.password.length < 6 ||
          user.Country.length < 1 ||
          user.City.length < 1 ||
          user.Birthday === "" ||
          user.email.length < 1 ||
          user.phone.toString().length < 3
          ? true
          : false
      );
    }, [user]);

    useImperativeHandle(ref, () => ({
      callSave() {
        if (existUserData) {
          // если редактируется пользователь
          if (existUserData.password != user.password) {
            // Если пароль был изменён
            if (user.password === repPass) {
              // и дважды введён верно
              saveUserChanges(user);
            } else {
              // если пароли разные
              alert("Please, repeat password correctly");
            }
          } else {
            // если пароль не менялся
            saveUserChanges(user);
          }
        } else {
          // если пользователь создаётся
          if (user.password === repPass) {
            // и пароль дважды введён верно
            saveUserChanges(user);
          } else {
            // если пароли разные
            alert("Please, repeat password correctly");
          }
        }
      }
    }));

    const inputOpenFileRef = useRef<HTMLInputElement>(null);

    const showOpenFileDlg = () => {
      if (inputOpenFileRef.current) {
        inputOpenFileRef.current.click();
      }
    };

    useEffect(() => {
      setVisible(false);
      setVisible(
        user.Country !== "" &&
          user.Country === selectedContry &&
          citiesBuf !== [""]
          ? true
          : false
      );
    }, [user.Country]);

    const outputContryData = (res: string) => {
      setVisible(false);
      setSelectedContryBuf(res);
      var newBuf =
        res !== ""
          ? cities.filter(
              element =>
                element.country_id ===
                contries.find(element => element.name_en === res)!.id
            )
          : [{ id: 0, country_id: 0, name_en: "" }];
      setCitiesBuf(Array.from(newBuf, element => element.name_en));
      setUser({ ...user, Country: res });
    };

    const outputCityData = (res: string) => {
      setSelectedCityBuf(res);
      setUser({ ...user, City: res });
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
                  await setUser({ ...user, avatar: res });
                } else {
                  const res = await image.getBase64Async(image.getMIME());
                  await setUser({ ...user, avatar: res });
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
          <Photo src={user.avatar} alt={"Photo is here"} />
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
          <TextInputItem
            required={true}
            label="Username:"
            placeholder="Your username in system"
            lenght="TextInput"
            value={user.username}
            onChange={e => setUser({ ...user, username: e })}
            restriction={{ type: "min length", length: 4 }}
          />
          <TextInputItem
            required={true}
            label="Password:"
            placeholder="Enter pass"
            type="password"
            lenght="TextInput"
            value={user.password}
            onChange={e => setUser({ ...user, password: e })}
            restriction={{ type: "min length", length: 6 }}
          />
          <TextInputItem
            required={true}
            label="Repeat:"
            placeholder="Repeat password"
            type="password"
            lenght="TextInput"
            onChange={e => setRepPass(e)}
            restriction={{ type: "same", with: user.password }}
          />
          <TextInputItem
            required={true}
            label="First Name:"
            placeholder="Enter name"
            lenght="TextInput"
            value={user.FirstName}
            onChange={e => setUser({ ...user, FirstName: e })}
            restriction={{ type: "min length", length: 3 }}
          />
          <TextInputItem
            required={true}
            label="Second Name:"
            placeholder="Enter name"
            lenght="TextInput"
            value={user.LastName}
            onChange={e => setUser({ ...user, LastName: e })}
            restriction={{ type: "min length", length: 3 }}
          />
          <AutoComplete
            key={3}
            label="Country"
            initValue={selectedContry}
            inputData={Array.from(contries, element => (
              <div key={element.name_en}>{element.name_en}</div>
            ))}
            outputData={outputContryData}
          />
          {visible ? (
            <AutoComplete
              key={4}
              label="City"
              initValue={selectedCity}
              inputData={citiesBuf.map(city => (
                <div key={city}>{city}</div>
              ))}
              outputData={outputCityData}
            />
          ) : null}
          <DateItem
            label="Birthday:"
            disabled={isDisabled}
            required={true}
            placeholder="Choose date"
            value={user.Birthday}
            onChange={e => setUser({ ...user, Birthday: e })}
            onInputError={
              user.Birthday === "mm/dd/yyyy" ? "Incorrect date" : undefined
            }
          />
          <TextInputItem
            required={true}
            label="E-mail:"
            type="email"
            placeholder="Enter e-mail"
            lenght="TextInput"
            value={user.email}
            onChange={e => setUser({ ...user, email: e })}
            restriction={{ type: "min length", length: 3 }}
          />
          <TextInputItem
            required={true}
            label="Tel.:"
            placeholder="Enter telephone number"
            lenght="TextInput"
            type="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            value={user.phone}
            onChange={e => {
              let number = e.replace(RegExp("([A-Za-zА-Яа-яЁё-]+)"), "");
              setUser({ ...user, phone: parseInt(number) });
            }}
            restriction={{ type: "type", restrict: "number" }}
          />
          <TextInputItem
            required={false}
            label="Status:"
            placeholder="Enter status"
            lenght="TextArea"
            value={user.Status}
            onChange={e => setUser({ ...user, Status: e })}
          />
        </EditorForm>
      </StyledEditor>
    );
  }
);

export default EditorBlock;
