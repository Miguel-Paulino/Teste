// Dados do jogo: recursos, construções, tecnologias, NPCs, missões e finais.
const T = {REG:0, ROCK:1, ICE:2, ORE:3, RUIN:4, GATE:5, RELIC:6};
const RES = {ox:'Oxigênio', wa:'Água', en:'Energia', fo:'Alimento', fu:'Combustível', mi:'Minerais', ma:'Materiais', pa:'Peças'};
const BUILD = {
  hab:{n:'Habitação', c:{ma:20}, col:'#c9d6e8', d:'+3 vagas de colonos por nível'},
  oxy:{n:'Estação de O₂', c:{ma:15,pa:2}, col:'#6ec6ff', d:'Produz oxigênio (usa energia e água)'},
  sol:{n:'Painel Solar', c:{ma:10,mi:5}, col:'#2a3f8f', d:'Gera energia durante o dia'},
  gen:{n:'Gerador', c:{ma:15,pa:3}, col:'#d98a2b', d:'Converte combustível em energia'},
  farm:{n:'Plantação Subterrânea', c:{ma:15,wa:10}, col:'#4caf50', d:'Produz alimento (usa água e energia)'},
  mine:{n:'Mina', c:{ma:20,pa:2}, col:'#8d6e63', d:'Produz minerais, materiais e um pouco de água (gelo)'},
  lab:{n:'Laboratório', c:{ma:25,pa:5}, col:'#b57edc', d:'Gera pontos de pesquisa'},
  sto:{n:'Armazém', c:{ma:20}, col:'#9e9e9e', d:'+100 de capacidade por nível'},
  ant:{n:'Antena de Comunicação', c:{ma:10,pa:6}, col:'#ff5252', d:'Permite comércio com a Terra'},
  def:{n:'Escudo Anti-Impacto', c:{ma:30,mi:15}, col:'#26c6da', d:'Reduz danos de tempestades e meteoritos'}
};
const TECH = {
  scan:{n:'Escâner Profundo', rp:20, d:'Abre o portão para as Ruínas Antigas'},
  recy:{n:'Reciclagem', rp:30, d:'Colonos consomem 20% menos'},
  hyd:{n:'Hidroponia', rp:40, d:'Plantações produzem 50% mais'},
  fus:{n:'Fusão Compacta', rp:50, d:'Painéis solares rendem 50% mais'}
};
const TRADES = [
  {give:{mi:10}, get:{fu:6}}, {give:{mi:15}, get:{pa:2}}, {give:{ma:20}, get:{fo:15}}, {give:{fo:20}, get:{pa:3}}
];
const NPCS = [
  {id:'aiko', n:'Dra. Aiko', x:26, y:19, col:'#c77dff',
   t:'Os sensores captam estruturas sob a cratera e ao norte. Precisamos decidir: ciência ou prudência?',
   o:[['Vamos investir em pesquisa.',{sci:2},'Excelente! Construa um laboratório e pesquise o Escâner Profundo.'],
      ['Primeiro, sobreviver.',{surv:1},'Sensato. Mas a ciência também pode nos salvar.']],
   hint:'Um laboratório e o Escâner Profundo abrirão o caminho ao norte.'},
  {id:'okafor', n:'Cmdr. Okafor', x:32, y:22, col:'#ffb74d',
   t:'A Terra quer resultados. Contratos com empresas e governos pagam bem... e cobram caro.',
   o:[['Aceito os contratos da Terra.',{earth:2,trade:1},'Ótimo. Com uma antena, a troca de recursos começa.'],
      ['Negociaremos por conta própria.',{trade:2,indep:1},'Arriscado, mas lucrativo. Boa sorte.']],
   hint:'Com a antena, o Comércio fica disponível no menu.'},
  {id:'rui', n:'Rui, o Engenheiro', x:24, y:25, col:'#81c784',
   t:'Cada parafuso aqui foi enviado da Terra. E se não precisássemos mais deles?',
   o:[['Devemos nos libertar da Terra.',{indep:2},'É isso! Mais gente e mais fábricas.'],
      ['Cooperar com a Terra é mais seguro.',{earth:1,surv:1},'Justo. Segurança primeiro.']],
   hint:'Precisamos de mais colonos: habitações e comida.'},
  {id:'marta', n:'Marta, a Arqueóloga', x:28, y:6, col:'#f06292',
   t:'Estou isolada aqui há meses. Esta relíquia pulsa com energia. Tocá-la pode mudar tudo.',
   o:[['Vou estudar a estrutura.',{sci:1},'Há um altar no fundo das ruínas. Você decide o que fazer.'],
      ['Melhor deixar isolado.',{surv:1},'Talvez você tenha razão. Há quem diga que ela vigia a Lua.']],
   hint:'O altar da relíquia fica ao norte, em (28,3).'}
];
const QUESTS = [
  {id:'q1', t:'Construir uma Habitação', r:{ma:20}},
  {id:'q2', t:'Ter Estação de O₂, Painel Solar e Plantação', r:{pa:3,ma:20}},
  {id:'q3', t:'Aiko: Laboratório + Escâner Profundo', need:'aiko', r:{pa:4}, f:{sci:1}},
  {id:'q4', t:'Okafor: Antena + 1 troca com a Terra', need:'okafor', r:{mi:20}, f:{trade:1}},
  {id:'q5', t:'Rui: chegar a 6 colonos', need:'rui', r:{ma:30}, f:{indep:1}},
  {id:'q6', t:'Marta: decidir o destino da relíquia', need:'marta', r:{pa:5}}
];
const ENDINGS = {
  colapso:{t:'Silêncio Lunar', x:'Sem colonos, a base ficou muda. A Lua guardou seus segredos... por enquanto.'},
  exodo:{t:'O Êxodo', x:'A moral desabou. Os colonos pegaram as naves de volta para a Terra.'},
  guardioes:{t:'Os Guardiões (final secreto)', x:'A relíquia despertou uma rede antiga sob a Lua. Sua ciência decifrou o código, e a humanidade ganhou aliados e um novo lar entre as estrelas.'},
  livre:{t:'Lua Livre', x:'A colônia declarou independência. Fábricas próprias e cultura própria: a humanidade tem uma segunda casa.'},
  imperio:{t:'Império Mineral', x:'Seus minerais abastecem a Terra. A colônia é rica, poderosa... e a Terra depende dela.'},
  ciencia:{t:'Era Científica', x:'A colônia virou o maior centro de pesquisa da humanidade. Descobertas mudam o futuro de dois mundos.'},
  pacto:{t:'Pacto Terrestre', x:'Com acordos duradouros, Terra e Lua crescem juntas sob regras comuns.'},
  lar:{t:'Lar Sustentável', x:'Uma colônia autossuficiente, estável e feliz. A vida floresce na Lua.'},
  fragil:{t:'Sobrevivência Frágil', x:'A colônia resistiu, mas sem rumo claro. Há esperança... e muito trabalho pela frente.'}
};