import "@logseq/libs";
import {
  BlockEntity,
  SettingSchemaDesc,
} from "@logseq/libs/dist/LSPlugin.user";

async function merge_nested_blocks(blockId: string) {
  const block = await logseq.Editor.getBlock(blockId, {
    includeChildren: true,
  });
  if (block === null || block.children?.length === 0) {
    return;
  }

  const newline = logseq.settings!["newlineBetweenBlocks"] ? "\n\n" : "\n";

  const children = block.children as BlockEntity[];
  let content = children.reduce(function (acc, block) {
    return acc + newline + block.content;
  }, "");

  await logseq.Editor.insertBlock(block.uuid, content, {
    before: false,
  });

  for (let child of children) {
    await logseq.Editor.removeBlock(child.uuid);
  }
}

const settings: SettingSchemaDesc[] = [
  {
    key: "newlineBetweenBlocks",
    title: "Add newline?",
    type: "boolean",
    default: true,
    description: "Adds a newline between blocks when merging.",
  },
];

logseq
  .ready(() => {
    logseq.Editor.registerBlockContextMenuItem(
      "Merge Nested Blocks Into One",
      async (e) => {
        merge_nested_blocks(e.uuid);
      }
    );

    logseq.Editor.registerSlashCommand(
      "Merge Nested Blocks Into One",
      async (e) => {
        merge_nested_blocks(e.uuid);
      }
    );

    logseq.useSettingsSchema(settings);
  })
  .catch(console.error);
