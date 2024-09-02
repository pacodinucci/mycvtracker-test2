import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  ActionIcon,
  Button,
  Flex,
  Paper,
  SimpleGrid,
  Slider,
  Text,
  Title,
  Alert,
} from "@mantine/core";
import { AudioResponse } from "../types/audioResponse_types";
import ReactHowler from "react-howler";
//import ReactPlayer from "react-player";

import {
  FaPlay,
  FaPause,
  FaStop,
  FaVolumeOff,
  FaVolumeMute,
  FaVolumeUp,
  FaVolumeDown,
  FaRedo,
} from "react-icons/fa";
import ReactPlayer from "react-player";

type Props = {
  data?: AudioResponse;
  source?: string;
  compact?: boolean;
  style?: {
    width: number | string;
    maxWidth: number | string;
  };
};

interface Howler extends ReactHowler {
  load: () => void;
}

const VideoPrevResponse = ({ data, source, compact, style }: Props) => {
  const player = useRef<Howler | null>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(100);
  const [duration, setDuration] = useState(100);
  const [seek, setSeek] = useState(0);
  const [mute, setMute] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [isVideo, setIsVideo] = useState<boolean>(false);

  const handleChangeVolume = useCallback((value: number) => {
    setMute(false);
    setVolume(value);
  }, []);
  const togglePlaySound = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const stopSound = useCallback(() => {
    if (player.current) {
      player.current.stop();
      setIsPlaying(false);
      setSeek(0);
    }
  }, [player]);

  const getSeek = useCallback(() => {
    if (player.current) {
      const val = player.current.seek();
      setSeek(val);
    }
  }, [player]);

  const handleSeek = useCallback(
    (value: number) => {
      console.log(value);
      if (player.current) {
        player.current.seek(value);
      }
      setSeek(value);
    },
    [player]
  );

  const onLoadComplete = useCallback(() => {
    setIsLoading(false);
    if (player.current) setDuration(player.current.duration());
  }, [player]);

  const handleToggleMute = useCallback(() => {
    setMute((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isPlaying && player.current) {
      const time = setInterval(getSeek, 50);
      return () => clearInterval(time);
    }
  }, [isPlaying, player, getSeek]);

  const handleReload = useCallback(() => {
    if (player.current) {
      setIsLoading(true);
      setError("");
      player.current.load();
    }
  }, [player]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const url = data
          ? `${process.env.NEXT_PUBLIC_MYCVTRACKER_API_HOST}/interviews/audioData/${data.token}/${data.questionId}`
          : source || "";

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch the video");

        const blob = await response.blob();

        console.log(blob);

        // Convert Blob into a URL object
        const videoUrl = URL.createObjectURL(
          new Blob([blob], { type: "video/webm" })
        );

        if (data?.answerLocation.endsWith(".mov")) {
          setIsVideo(true);
        }

        setUrl(videoUrl);
        setIsLoading(false);
      } catch (err) {
        setError("Error loading video");
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [data, source]);

  return (
    <Paper p={compact ? "sm" : "md"} my={compact ? "sm" : "md"} style={style}>
      <Text fz="sm" style={{ marginTop: 16, marginBottom: 8 }}>
        {data && <Title order={6}>{data.question}</Title>}
      </Text>

      <ReactPlayer
        url={url}
        playing={isPlaying}
        // volume={volume}
        muted={mute}
        controls
        width="100%"
        height={isVideo ? "auto" : "50px"}
        onReady={() => setIsLoading(false)}
        onDuration={setDuration}
        onProgress={({ playedSeconds }) => setSeek(playedSeconds)}
        onError={() => setError("Error loading media")}
        // style={{ border: "2px solid green" }}
      />

      {!compact && (
        <SimpleGrid
          mt="md"
          cols={error.length > 0 ? 3 : 6}
          breakpoints={[
            { maxWidth: 1200, cols: 3, spacing: "md" },
            { maxWidth: 900, cols: 2, spacing: "md" },
            { maxWidth: 400, cols: 1, spacing: "md" },
          ]}
        >
          {error.length === 0 && (
            <>
              <Button
                onClick={togglePlaySound}
                disabled={isLoading}
                leftIcon={isPlaying ? <FaPause /> : <FaPlay />}
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                onClick={stopSound}
                disabled={isLoading}
                leftIcon={<FaStop />}
                color="red"
              >
                Stop
              </Button>
            </>
          )}
          {error.length !== 0 && (
            <Alert color="red" title="Error loading Media">
              <Flex align="center" justify="space-between">
                {error}
                <ActionIcon onClick={handleReload}>
                  <FaRedo />
                </ActionIcon>
              </Flex>
            </Alert>
          )}
          <Flex align="center" gap="sm" justify="flex-start">
            <div onClick={handleToggleMute}>
              {mute && <FaVolumeMute />}
              {!mute &&
                (volume > 60 ? (
                  <FaVolumeUp />
                ) : volume < 10 ? (
                  <FaVolumeOff />
                ) : (
                  <FaVolumeDown />
                ))}
            </div>
            <Slider
              style={{ width: "100%" }}
              id="volume"
              onChange={handleChangeVolume}
              value={mute ? 0 : volume}
            />
          </Flex>
        </SimpleGrid>
      )}
    </Paper>
  );
};

export default VideoPrevResponse;
