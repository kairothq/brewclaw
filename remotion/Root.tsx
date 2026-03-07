import { Composition } from "remotion";
import { BotTokenVideo } from "./BotTokenVideo";
import { UserIdVideo } from "./UserIdVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BotTokenVideo"
        component={BotTokenVideo}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="UserIdVideo"
        component={UserIdVideo}
        durationInFrames={600} // 20 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
