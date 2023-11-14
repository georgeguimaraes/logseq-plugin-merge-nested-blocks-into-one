import "@logseq/libs";
import {
  BlockEntity,
  SettingSchemaDesc,
} from "@logseq/libs/dist/LSPlugin.user";

function content_from_nested_blocks(parent_block: BlockEntity): string {
  const newline = logseq.settings!["newlineBetweenBlocks"] ? "\n\n" : "\n";
  const children = parent_block.children as BlockEntity[];

  const content = children.reduce(function(acc: string, block: BlockEntity) {
    if (block.children?.length > 0) {
      return acc + newline + block.content + content_from_nested_blocks(block);
    } else {
      return acc + newline + block.content;
    }
  }, "")

  return content
}

async function merge_nested_blocks(parent_block_id: string) {
  const block = await logseq.Editor.getBlock(parent_block_id, {
    includeChildren: true,
  });
  if (block === null || block.children?.length === 0) {
    return;
  }

  const content = content_from_nested_blocks(block)

  await logseq.Editor.insertBlock(block.uuid, content, {
    before: false,
  });

  for (let child of block.children as BlockEntity[]) {
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
