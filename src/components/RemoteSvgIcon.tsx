// src/components/RemoteSvgIcon.tsx
import React, { useEffect, useState } from "react";
import { SvgXml } from "react-native-svg";
import { ActivityIndicator } from "react-native";

type Props = {
  uri: string;
  size?: number;
  color?: string;
};

const RemoteSvgIcon = ({ uri, size = 24, color = "#000" }: Props) => {
  const [svgXml, setSvgXml] = useState<string | null>(null);

  useEffect(() => {
    fetch(uri)
      .then((res) => res.text())
      .then((text) => {
        const updatedSvg = text.replace(/fill=".*?"/g, `fill="${color}"`);
        setSvgXml(updatedSvg);
      })
      .catch((err) => {
        console.error("Erro ao carregar SVG remoto:", err);
      });
  }, [uri, color]);

  if (!svgXml) return <ActivityIndicator size="small" />;

  return <SvgXml xml={svgXml} width={size} height={size} />;
};

export default RemoteSvgIcon;