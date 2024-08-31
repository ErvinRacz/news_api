{
  description = "A simple dev shell definition";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    # Default systems are ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"]
    flake-utils.lib.eachDefaultSystem (system:
      let
        # no need to define 'system' anymore because of the 'eachDefaultSystem'
        pkgs = nixpkgs.legacyPackages.${system};
        projectName = "News API";
      in
      {

        # `eachDefaultSystem` transforms the input, our output set
        # now simply has `packages.default` or `devShells.default` which gets turned into
        # `packages.${system}.default` (for each system)
        devShells.default =
          (
            pkgs.mkShell {
              name = "${projectName}-shell";
              packages = with pkgs;
                [
                  git
                  gum
                  deno
                ];

              shellHook = /*bash*/ ''
                gum log --level info "'--- git status ---'"
                git status
                gum log --level info "'--- deno version ---'"
                deno --version
              '';
            }
          );
      }
    );
}
