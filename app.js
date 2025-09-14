const { select, input, checkbox } = require("@inquirer/prompts");

let mensagem = "Bem vindo ao App de Metas!";

let metas = [];

const cadastrarMeta = async () => {
  const meta = await input({ message: "Digite a meta:"});

  if (meta.length === 0) {
    mensagem = "A meta não pode ser vazia!";
    return;
  }

  metas.push({ value: meta, checked: false });

  mensagem = "Meta cadastrada com sucesso!";
}

const listarMetas = async () => {
  if (metas.length === 0) {
    mensagem = "Nenhuma meta para concluir!";
    return;
  }

  const respostas = await checkbox({
    message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e enter para finalizar.",
    choices: [...metas],
    instructions: false
  });

  metas.forEach((m) => {
    m.checked = false;
  });

  if (respostas.length === 0) {
    mensagem = "Nenhuma meta selecionada!";
    return;
  }

  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value === resposta;
    });

    meta.checked = true;
  });

  mensagem = "Meta(s) marcada(s) como concluída(s)!";
}

const metasRealizadas = async () => {
  const realizadas = metas.filter((meta) => {
    return meta.checked;
  });

  if (realizadas.length === 0) {
    mensagem = "Não existem metas realizadas! :(";
    return;
  }
  
  await select({
    message: `Metas realizadas: ${realizadas.length} >`,
    choices: [...realizadas]
  });
}

const metasAbertas = async () => {
  const abertas = metas.filter((meta) => {
    return !meta.checked;
  });
  
  if (abertas.length === 0) {
    mensagem = "Não existem metas abertas! :)";
    return;
  }

  await select({
    message: `Metas abertas: ${abertas.length} >`,
    choices: [...abertas]
  });
}

const deletarMetas = async () => {
  const metasDesmarcadas = metas.map((meta) => {
    return { value: meta.value, checked: false }
  });
  
  if (metasDesmarcadas.length === 0) {
    mensagem = "Nenhuma meta para deletar!";
    return;
  }

  const metasParaDeletar = await checkbox({
    message: "Selecione um item para deletar.",
    choices: [...metasDesmarcadas],
    instructions: false
  });

  if (metasParaDeletar.length === 0) {
    mensagem = "Nenhuma meta para deletar!";
    return;
  }

  metasParaDeletar.forEach((item) => {
    metas = metas.filter((m) => {
      return m.value !== item;
    });
  });

  mensagem = "Meta(s) deletada(s) com sucesso!";
}

const mostrarMensagem = () => {
  console.clear();

  if (mensagem !== "") {
    console.log(`\n${mensagem}\n`);
    mensagem = "";
  }
}

const start = async () => {

  while (true) {
    mostrarMensagem();
    const opcao = await select({
      message: "Menu >",
      choices: [
        {
          name: "Cadastrar meta",
          value: "cadastrar"
        },
        {
          name: "Listar metas",
          value: "listar"
        },
        {
          name: "Metas realizadas",
          value: "realizadas"
        },
        {
          name: "Metas abertas",
          value: "abertas"
        },
        {
          name: "Deletar metas",
          value: "deletar"
        },
        {
          name: "Sair",
          value: "sair"
        }
      ]
    });

    switch (opcao) {
      case "cadastrar":
        await cadastrarMeta();
        break;
      case "listar":
        await listarMetas();
        break;
      case "realizadas":
        await metasRealizadas();
        break;
      case "abertas":
        await metasAbertas();
        break;
      case "deletar":
        await deletarMetas();
        break;
      case "sair":
        console.log("\nAté a próxima!");
        return;
    }
  }
}

start();