---
title: /proc
tags: post
date: 2025-11-14 16:20:00Z
linkClass: blue link hover-light-pink
layout: layouts/post.njk
---

The operating system was meant to execute programs and a _process_ is an instance of an executing program. In Linux the `/proc` directory contains information about processes that are running. Each process running has a subdirectory that is the PID of the process.

Inside will look something like this:

```text
$ ls /proc/470

attr	   cmdline	    environ  io
loginuid   mounts	oom_adj
projid_map  setgroups	statm		timers
autogroup   comm	    exe
ksm_merging_pages  map_files  mountstats
oom_score root	  smaps	 status	timerslack_ns
auxv	   coredump_filter  fd       ksm_stat
maps	   net		oom_score_adj
sched	  smaps_rollup  syscall	uid_map
cgroup	   cpuset	    fdinfo   latency
mem	   ns		pagemap
schedstat   stack	task		wchan
clear_refs  cwd		    gid_map  limits
mountinfo  numa_maps	personality
sessionid   stat		timens_offsets

```

The two files I want to focus on right now is `stat` and `status`. As I understand it they contain about the same information, but `status` is a more human readable form.

```text
$ cat /proc/470/status

Name:	systemd-timesyn
Umask:	0022
State:	S (sleeping)
Tgid:	470
Ngid:	0
Pid:	470
PPid:	1
TracerPid:	0
Uid:	996	996	996	996
Gid:	996	996	996	996
FDSize:	128
Groups:	996
NStgid:	470
NSpid:	470
NSpgid:	470
NSsid:	470
Kthread:	0
VmPeak:	 156296 kB
VmSize:	  90760 kB
VmLck:	      0 kB
VmPin:	      0 kB
VmHWM:	   6912 kB
VmRSS:	   6912 kB
RssAnon:	    768 kB
RssFile:	   6144 kB
RssShmem:	      0 kB
VmData:	   8800 kB
VmStk:	    132 kB
VmExe:	     52 kB
VmLib:	  14048 kB
VmPTE:	     76 kB
VmSwap:	      0 kB
HugetlbPages:	      0 kB
CoreDumping:	0
THP_enabled:	1
untag_mask:	0xffffffffffffff
Threads:	2
SigQ:	0/7537
SigPnd:	0000000000000000
ShdPnd:	0000000000000000
SigBlk:	0008000000004002
SigIgn:	0000000000001000
SigCgt:	0000000100000000
CapInh:	0000000002000000
CapPrm:	0000000002000000
CapEff:	0000000002000000
CapBnd:	0000000002000000
CapAmb:	0000000002000000
NoNewPrivs:	1
Seccomp:	2
Seccomp_filters:	20
Speculation_Store_Bypass:	vulnerable
SpeculationIndirectBranch:	unknown
Cpus_allowed:	3
Cpus_allowed_list:	0-1
Mems_allowed:	00000000,00000001
Mems_allowed_list:	0
voluntary_ctxt_switches:	216
nonvoluntary_ctxt_switches:	59
```

Pretty cool! You are going to have a subdirectory for every process running on your system and be able to get a ton of info about them. You an every programatically look at the files in those directories and use that information to see what your process is doing. This is how tools like `ps` and `top` work.

Here is a small example of doing this in Rust:

```rust
let entries: Vec<_> = fs::read_dir("/proc")?
        .filter_map(|res| res.ok())
        .map(|e| e.path())
        .filter(|path| {
            path.file_name()
                .and_then(|name| name.to_str())
                .and_then(|s| s.parse::<u32>().ok())
                .is_some()
        })
        .collect();

    // Fields we want to display
    let wanted_fields = ["Name", "State", "Pid", "PPid"];

    // Collect all process data
    let mut processes = Vec::new();

    for entry in entries {
        let mut path = entry;
        path.push("status");

        if let Ok(status) = fs::read_to_string(&path) {
            let fields: Vec<(String, String)> = status
                .lines()
                .filter_map(|line| {
                    let mut parts = line.splitn(2, ':');
                    let name = parts.next()?.trim().to_string();
                    let value = parts.next()?.trim().to_string();

                    // Only keep fields we want
                    if wanted_fields.contains(&name.as_str()) {
                        Some((name, value))
                    } else {
                        None
                    }
                })
                .collect();

            if !fields.is_empty() {
                processes.push(fields);
            }
        }
    }

    if processes.is_empty() {
        return Ok(());
    }

    // Print headers
    println!("{}", wanted_fields.join("\t"));

    // Print values for each process
    for fields in &processes {
        let values: Vec<_> = wanted_fields
            .iter()
            .map(|field_name| {
                fields
                    .iter()
                    .find(|(name, _)| name == field_name)
                    .map(|(_, value)| value.as_str())
                    .unwrap_or("")
            })
            .collect();
        println!("{}", values.join("\t"));
    }
```

Going to keep diving deep into `/proc` and learning about processes in general. Party hard!
