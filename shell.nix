{ pkgs ? import <nixpkgs> {}, arg ? "" }:

let
  var="random";

in pkgs.mkShell {
  name = "rafi-microblog-dev-env";

  buildInputs = [
    pkgs.zellij
    pkgs.sqlite
    pkgs.deno
  ];

  shellHook = ''
    #====================================================
    #                      PORTS
    #====================================================
    export DATABASE_PORT="8000"
    export AUTHOR_PORT="8001"

  if ls | grep app.db; then
      echo "app.db exists"
  else
      sqlite3 app.db "VACUUM;"
  fi

    mkdir -p build

    zellij --config zellij.config.kdl -n zellij.layout.kdl

    zellij da -y

    echo "🚪 Exiting Nix shell..."
    exit
  '';
}
