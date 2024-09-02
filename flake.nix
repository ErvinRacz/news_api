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
        devShells.bootstrap =
          pkgs.mkShell {
            name = "${projectName}-bootstrap-shell";
            packages = with pkgs;
              [
                git
                gum
                git-crypt
              ];

            shellHook = /*bash*/ ''
              gum confirm "Do you want to clone the ${projectName} project in the $(pwd)/news_api directory?" && git clone git@github.com:ErvinRacz/news_api.git
              cd news_api && git-crypt unlock .git-crypt-key && cd ../
              gum confirm "Do you allow the installation of direnv for your nix profile? Necessary for automatic installation of your dev env. All dependencies will be installed on changing the directory to $(pwd)/news_api." && nix profile install nixpkgs#direnv nixpkgs#nix-direnv
              direnv allow news_api/
              exit
            '';
          };
        devShells.default =
          pkgs.mkShell {
            name = "${projectName}-shell";
            packages = with pkgs;
              [
                git
                gum
                deno
                colima
                just
                git-crypt
                jq
                kubectl
              ];
            env = {
              GNEWS_API_KEY = import ./.secrets/gnews-api-key.secret;
              GNEWS_BASE_URL = "https://gnews.io/api/v4";
              NEWS_API_PORT = 8000;
            };

            shellHook = /*bash*/ ''
              gum log --level info "'--- git status ---'"
              git status
              gum log --level info "'--- deno version ---'"
              deno --version
              echo
              echo "🍎🍎 Run 'just <recipe>' to get started"
              just
            '';
          };
      }
    );
}
