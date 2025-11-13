// src/components/ArgumentTree.jsx
export function ArgumentTree({ tree, onSelectParent, onAddArgument }) {
  const renderNode = (node, depth = 0) => {
    return (
      <div style={{ marginLeft: depth * 20 }}>
        <div className="argument-node">
          <span>{node.thesis}</span>
          <button onClick={() => onSelectParent(node.id)}>
            Ajouter sous-argument
          </button>
        </div>
        {node.children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return <div className="argument-tree">{renderNode(tree)}</div>;
}
