import React, { useState } from "react";
import { Button } from "./button";
import { SmilePlus } from "lucide-react";
import { default as EmojiPickerComponent, Theme } from "emoji-picker-react";

type EmojiPickerProps = {
  onEmojiClick: (emoji: any) => void;
  value: string;
};

const EmojiPicker = ({ onEmojiClick, value }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-4xl">{value}</p>
      </div>
      {isOpen && (
        <EmojiPickerComponent
          theme={Theme.DARK}
          previewConfig={{ showPreview: false }}
          onEmojiClick={(emoji) => onEmojiClick(emoji.emoji)}
          lazyLoadEmojis
        />
      )}
    </div>
  );
};

export default EmojiPicker;
