import "@logseq/libs";

async function merge_nested_blocks(blockId: string) {
  const block = await logseq.Editor.getBlock(blockId, {
    includeChildren: true,
  });
  if (block === null || block.children?.length === 0) {
    return;
  }

  const children = block.children as BlockEntity[];
  let content = children.reduce(function (acc, block) {
    return acc + "\n\n" + block.content;
  }, "");

  await logseq.Editor.insertBlock(block.uuid, content, {
    before: false,
  });

  for (let child of children) {
    await logseq.Editor.removeBlock(child.uuid);
  }
}

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
  })
  .catch(console.error);
