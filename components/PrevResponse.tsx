import React, { useCallback, useEffect, useState, useRef } from "react";
import { ActionIcon, Button, Flex, Paper, SimpleGrid, Slider, Text, Title, Alert } from "@mantine/core";
import { AudioResponse } from "../types/audioResponse_types";
import ReactHowler from "react-howler";

import { FaPlay, FaPause, FaStop, FaVolumeOff, FaVolumeMute, FaVolumeUp, FaVolumeDown, FaRedo } from "react-icons/fa";

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

const PrevResponse = ({ data, source, compact, style }: Props) => {
  const player = useRef<Howler | null>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(100);
  const [duration, setDuration] = useState(100);
  const [seek, setSeek] = useState(0);
  const [mute, setMute] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <Paper p={compact ? "sm" : "md"} my={compact ? "sm" : "md"} style={style}>
      <Text fz="sm" style={{ marginTop: 16}}>
        {data && <Title order={6}>{data.question}</Title>}
        {isLoading ? "Loading..." : `Duration: ${seek.toFixed(2)}/${duration.toFixed(2)}`}
      </Text>
      <Flex align="center">
        <Slider
          onChange={handleSeek}
          label={(value) => value.toFixed(1)}
          step={0.1}
          style={{ width: "100%" }}
          max={duration}
          value={seek}
          disabled={isLoading}
        />
        {compact && <ActionIcon onClick={togglePlaySound}>{isPlaying ? <FaPause /> : <FaPlay />}</ActionIcon>}
      </Flex>
      <ReactHowler
        src={
          data
            ? `${process.env.NEXT_PUBLIC_MYCVTRACKER_API_HOST}/interviews/audioData/${data.token}/${data.questionId}`
            : source
            ? source
            : ""
        }
        format={["wav"]}
        playing={isPlaying}
        onEnd={() => {
          setIsPlaying(false);
          setSeek(0);
        }}
        volume={volume / 100}
        mute={mute}
        ref={(ref: Howler) => (player.current = ref)}
        onLoad={onLoadComplete}
        onLoadError={() => setError("Unable to Load Media")}
        onPlayError={() => setError("Unable to Play Media")}
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
              <Button onClick={togglePlaySound} disabled={isLoading} leftIcon={isPlaying ? <FaPause /> : <FaPlay />}>
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button onClick={stopSound} disabled={isLoading} leftIcon={<FaStop />} color="red">
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
              {!mute && (volume > 60 ? <FaVolumeUp /> : volume < 10 ? <FaVolumeOff /> : <FaVolumeDown />)}
            </div>
            <Slider style={{ width: "100%" }} id="volume" onChange={handleChangeVolume} value={mute ? 0 : volume} />
          </Flex>
        </SimpleGrid>
      )}
    </Paper>
  );
};

export default PrevResponse;
