import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Self-contained SVG assets: no services, JavaScript, or remote fonts in the images.
// Run with `node scripts/build-assets.mjs` from this repository.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const palettes = {
  light: {bg:'#EEF7FA',text:'#1F2937',muted:'#526574',line:'#CADAE3',grid:'#D6E6ED',teal:'#087D81',blue:'#4262B5',soft:'#E3F2F1'},
  dark: {bg:'#081621',text:'#E6EDF3',muted:'#A0AFBC',line:'#293F4E',grid:'#19313E',teal:'#65EBDC',blue:'#8AA8FF',soft:'#102C30'}
};
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const phase = {a:'0;0.321428571;0.785714286;1', b:'0;0.357142857;0.785714286;1', break:'0;0.321428571;0.785714286;1'};

function banner(p, mobile, still) {
  const w=mobile?640:1200, h=mobile?980:610;
  const x1=mobile?77:689, x2=mobile?263:843, x3=mobile?377:963, x4=mobile?563:1117;
  const upper=mobile?493:226, middle=mobile?591:323, lower=mobile?696:420;
  const center=(x2+x3)/2;
  const routeA=`M${x1} ${middle} L${x2} ${upper} L${x3} ${upper} L${x4} ${middle}`;
  const routeB=`M${x1} ${middle} L${x2} ${lower} L${x3} ${lower} L${x4} ${middle}`;
  const mono='ui-monospace, SFMono-Regular, Consolas, monospace';
  const text=(x,y,value,size=22,color=p.text,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${escape(value)}</text>`;
  const animatedOpacity=(initial,values,times)=>`opacity="${initial}">${still?'':`<animate attributeName="opacity" values="${values}" keyTimes="${times}" dur="14s" calcMode="discrete" repeatCount="indefinite"/>`}`;
  const state=(label,initial,values,times)=>`<g ${animatedOpacity(initial,values,times)}${text(mobile?54:687,mobile?806:507,label,mobile?24:21,p.muted,`font-family="${mono}"`)}</g>`;
  const grid=`<rect x="${mobile?38:654}" y="${mobile?445:176}" width="${mobile?565:498}" height="${mobile?304:283}" fill="url(#dot-grid)"/>`;
  let nodes='';
  for(const [x,y,end,label] of [[x1,middle,true,'Users'],[x2,upper,false,''],[x3,upper,false,''],[x4,middle,true,'Services'],[x2,lower,false,''],[x3,lower,false,'']]){
    nodes+=`<circle cx="${x}" cy="${y}" r="${end?17:10}" fill="${end?p.soft:p.bg}" stroke="${end?p.teal:p.muted}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${end?4:3}" fill="${p.muted}"/>`;
    if(label) nodes+=text(x,y+44,label,mobile?24:21,p.muted,`text-anchor="middle" font-family="${mono}"`);
  }
  function packet(route,primary){
    const color=primary?p.teal:p.blue;
    const opacity=primary?'1;0;1;1':'0;1;0;0';
    const points=primary?'0;1;0;0.5;0;1':'0;0;1;0;1;1';
    const times=primary?'0;0.214285714;0.214357143;0.321428571;0.785714286;1':'0;0.357142857;0.571428571;0.5715;0.785714286;1';
    if(still) return primary?`<g transform="translate(${x2+30} ${upper})"><circle r="13" fill="${color}" opacity=".4" filter="url(#glow)"/><circle r="6" fill="${color}"/></g>`:'';
    return `<g ${animatedOpacity(primary?1:0,opacity,primary?phase.a:phase.b)}<circle r="13" fill="${color}" opacity=".5" filter="url(#glow)"/><circle r="6" fill="${color}"/><animateMotion path="${route}" keyPoints="${points}" keyTimes="${times}" dur="14s" calcMode="linear" repeatCount="indefinite"/></g>`;
  }
  const name=mobile?
    `${text(36,134,'Hello, I’m',24,p.muted,`font-family="${mono}"`)}${text(34,211,'John Sam-Bruce',64,p.text,'font-weight="700" letter-spacing="-2.5"')}${text(36,279,'Networks people',41,p.teal)}${text(36,329,'can depend on.',41,p.teal)}${text(36,377,'RESILIENCE / AVAILABILITY / SECURITY',22,p.muted,`font-family="${mono}"`)}`:
    `${text(46,173,'Hello, I’m',23,p.muted,`font-family="${mono}"`)}${text(42,260,'John',88,p.text,'font-weight="700" letter-spacing="-3"')}${text(42,355,'Sam-Bruce',88,p.text,'font-weight="700" letter-spacing="-3"')}${text(44,414,'Networks people',36,p.teal)}${text(44,458,'can depend on.',36,p.teal)}${text(46,512,'RESILIENCE / AVAILABILITY / SECURITY',20,p.muted,`font-family="${mono}"`)}`;
  const markX=mobile?36:46, badgeX=mobile?386:948;
  const statusY=mobile?775:475;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title description">
<title id="title">John Sam-Bruce — Networks people can depend on</title>
<desc id="description">CCNA certified. Network engineering, resilience, availability, and security. ${still?'A conceptual network with alternate paths.':'A conceptual packet animation: the primary link is interrupted, traffic takes the alternate path, and the primary path is restored. This illustration does not represent measured network performance.'}</desc>
<defs><filter id="glow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="5"/></filter><pattern id="dot-grid" patternUnits="userSpaceOnUse" width="23" height="23" x="${mobile?38:654}" y="${mobile?445:176}"><circle cx="1" cy="1" r="1.05" fill="${p.grid}"/></pattern></defs>
<rect x="1" y="1" width="${w-2}" height="${h-2}" rx="9" fill="${p.bg}" stroke="${p.line}" stroke-width="2"/>
<g font-family="Arial, Helvetica, sans-serif">
${text(markX,68,'JSB',mobile?34:36,p.text,'font-weight="700" letter-spacing="-1"')}${text(markX+65,68,'.',36,p.teal,'font-weight="700"')}
${mobile?'':text(145,64,'NETWORK ENGINEERING',20,p.muted,`font-family="${mono}" letter-spacing="1.2"`)}
<rect x="${badgeX}" y="31" width="208" height="47" rx="4" fill="${p.soft}" stroke="${p.teal}" stroke-opacity=".45"/>
${text(badgeX+104,62,'CCNA CERTIFIED',21,p.teal,`text-anchor="middle" font-family="${mono}" font-weight="600"`)}
${name}
${text(mobile?36:center,mobile?428:151,'THE ART OF STAYING CONNECTED',mobile?23:20,p.muted,`text-anchor="${mobile?'start':'middle'}" font-family="${mono}" letter-spacing=".6"`)}
${grid}
<g fill="none" stroke="${p.line}" stroke-width="2" stroke-dasharray="5 9"><path d="${routeA}"/><path d="${routeB}"/></g>
<g ${animatedOpacity(1,'1;0;1;1',phase.a)}<path d="${routeA}" fill="none" stroke="${p.teal}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></g>
<g ${animatedOpacity(0,'0;1;0;0',phase.b)}<path d="${routeB}" fill="none" stroke="${p.blue}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></g>
<g ${animatedOpacity(0,'0;1;0;0',phase.break)}<path d="M${center-18} ${upper}H${center+18}" stroke="${p.bg}" stroke-width="6"/></g>
${nodes}
${packet(routeA,true)}${packet(routeB,false)}
${text(center,mobile?465:192,'PATH A',mobile?24:21,p.muted,`font-family="${mono}" text-anchor="middle" letter-spacing="2"`)}
${text(center,mobile?741:458,'PATH B',mobile?24:21,p.muted,`font-family="${mono}" text-anchor="middle" letter-spacing="2"`)}
<path d="M${mobile?36:666} ${statusY}H${mobile?604:1149}" stroke="${p.line}"/>
<circle cx="${mobile?41:674}" cy="${mobile?798:500}" r="4" fill="${p.teal}"/>
${state('Primary path forwarding',1,'1;0;0;0;1','0;0.321428571;0.357142857;0.785714286;1')}
${still?'':state('Link interrupted',0,'0;1;0;0','0;0.321428571;0.357142857;1')}
${still?'':state('Alternate path forwarding',0,'0;1;0;0',phase.b)}
${still?'':state('Primary path restored',0,'0;1;0','0;0.785714286;1')}
${text(mobile?604:1149,mobile?806:507,'CONCEPT',mobile?22:18,p.muted,`text-anchor="end" font-family="${mono}" letter-spacing=".4"`)}
<path d="M1 ${mobile?857:551}H${w-1}" stroke="${p.line}"/>
${text(mobile?36:46,mobile?903:586,'ROUTING · SWITCHING · NETWORK SECURITY',mobile?21:20,p.muted,`font-family="${mono}"`)}
${text(mobile?36:1153,mobile?946:586,'EVE-NG / CISCO IOS',mobile?23:20,p.muted,`font-family="${mono}" text-anchor="${mobile?'start':'end'}"`)}
</g>
</svg>
`;
}

await fs.mkdir(path.join(root,'assets'),{recursive:true});
for(const [theme,p] of Object.entries(palettes)) for(const mobile of [false,true]) for(const still of [false,true]) {
  const filename=`signal-banner-${mobile?'mobile-':''}${theme}${still?'-still':''}.svg`;
  await fs.writeFile(path.join(root,'assets',filename),banner(p,mobile,still));
}
console.log('Built 8 Signal banners: desktop/mobile, light/dark, animated/still.');
