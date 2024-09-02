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
              cd news_api && git-crypt unlock .git-crypt-key
              gum input --password --placeholder="Password" --header="Give permission to update the nix-store." | sudo -nS cp ./.secrets/gnews-api-key.secret ${self}/.secrets/gnews-api-key.secret
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
                docker
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
