"""Shared Blender export arguments. Outputs must not exist; sources are never saved."""
import argparse, sys
from pathlib import Path

def export_paths(outputs):
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True,help='Staging asset directory')
    args=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
    source=args.source.resolve(); output=args.output.resolve()
    if not source.is_file() or source.suffix.lower()!='.blend':
        parser.error('Source must be an existing .blend file')
    for name in outputs:
        if (output/name).exists():parser.error('Refusing to overwrite '+str(output/name))
    output.mkdir(parents=True,exist_ok=True)
    return source,output
