import "@logseq/libs";
// 
// async function content_for_block_array(blocks: BlockEntity[]) {
//   console.log("aaaa")
//   let content = blocks.reduce(function (acc, block) {
//     return acc + "\n\n" + content_for_block_and_children(block)
//   }, "");
//   console.log(content);
//   return content;
// }
// 
// async function content_for_block_and_children(block: BlockEntity) {
//   if (block.children?.length === 0) {
//     return block.content
//   }
//   else {
//     let children = block.children as BlockEntity[];
//     let content = children.reduce(function (acc, block) { return acc + "\n\n" + content_for_block_and_children(block) }, "");
//     console.log("content for block and children");
//     console.log(content);
//     return content;
//   }
// }
// 
async function merge_nested_blocks(blockId: string) {
  const parent_block = await logseq.Editor.getBlock(blockId, {
    includeChildren: true
  });
  if (block === null || block.children?.length === 0) {
    return;
  }

  const children = parent_block.children as BlockEntity[];

  let content =  "testing" //await content_for_block_array(children);

  await logseq.Editor.insertBlock(parent_block.uuid, content, {
    before: false
  });

//   for (let child of children) {
//     await logseq.Editor.removeBlock(child.uuid);
//   };
}

logseq
.ready(() => {
  logseq.Editor.registerBlockContextMenuItem("Merge Nested Blocks Into One", async (e) => {
    merge_nested_blocks(e.uuid);
  });

  logseq.Editor.registerSlashCommand("Merge Nested Blocks Into One", async (e) => {
    merge_nested_blocks(e.uuid);
  });
})
.catch(console.error);
